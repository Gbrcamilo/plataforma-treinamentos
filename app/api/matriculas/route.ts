import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

async function getUser(request: NextRequest) {
  const token = request.cookies.get('hds-token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

// GET /api/matriculas — lista matrículas do usuário logado (ou todas para admin/gestor)
export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const usuarioId = searchParams.get('usuario_id')

  let matriculas
  if (user.perfil === 'admin' || user.perfil === 'gestor') {
    const targetId = usuarioId || null
    matriculas = await sql`
      SELECT m.*, c.titulo as curso_titulo, c.carga_horaria,
             u.nome as usuario_nome, u.area, u.cargo
      FROM matriculas m
      JOIN cursos c ON m.curso_id = c.id
      JOIN usuarios u ON m.usuario_id = u.id
      WHERE (${targetId}::text IS NULL OR m.usuario_id::text = ${targetId})
      ORDER BY m.matriculado_em DESC
    `
  } else {
    matriculas = await sql`
      SELECT m.*, c.titulo as curso_titulo, c.descricao, c.carga_horaria,
             c.categoria, c.nivel, c.thumbnail_url
      FROM matriculas m
      JOIN cursos c ON m.curso_id = c.id
      WHERE m.usuario_id = ${user.sub}
      ORDER BY m.matriculado_em DESC
    `
  }

  return NextResponse.json({ matriculas })
}

// POST /api/matriculas — matricula usuário em curso
export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const { curso_id, usuario_id } = body

  // Colaborador só pode se matricular a si mesmo
  const targetUserId = (user.perfil === 'admin' || user.perfil === 'gestor') && usuario_id
    ? usuario_id
    : user.sub

  const sql = neon(process.env.DATABASE_URL!)

  // Verifica se já matriculado
  const existing = await sql`
    SELECT id FROM matriculas WHERE usuario_id = ${targetUserId} AND curso_id = ${curso_id}
  `
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Usuário já matriculado neste curso' }, { status: 409 })
  }

  const [matricula] = await sql`
    INSERT INTO matriculas (usuario_id, curso_id, status, progresso)
    VALUES (${targetUserId}, ${curso_id}, 'em_andamento', 0)
    RETURNING *
  `

  return NextResponse.json({ matricula }, { status: 201 })
}
