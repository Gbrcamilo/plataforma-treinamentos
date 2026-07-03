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

// GET /api/cursos — lista cursos (admin vê todos, colaborador vê por perfil)
export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const busca = searchParams.get('busca')

  let cursos
  if (user.perfil === 'admin') {
    cursos = await sql`
      SELECT c.*, u.nome as criado_por_nome,
             COUNT(DISTINCT m.id) as total_matriculas
      FROM cursos c
      LEFT JOIN usuarios u ON c.criado_por = u.id
      LEFT JOIN matriculas m ON c.id = m.curso_id
      WHERE (${categoria}::text IS NULL OR c.categoria = ${categoria})
        AND (${busca}::text IS NULL OR c.titulo ILIKE ${'%' + (busca || '') + '%'})
      GROUP BY c.id, u.nome
      ORDER BY c.criado_em DESC
    `
  } else {
    // colaborador/gestor só vê cursos publicados
    cursos = await sql`
      SELECT c.id, c.titulo, c.descricao, c.categoria, c.carga_horaria,
             c.nivel, c.thumbnail_url, c.obrigatorio,
             m.status as meu_status, m.progresso as meu_progresso
      FROM cursos c
      LEFT JOIN matriculas m ON c.id = m.curso_id AND m.usuario_id = ${user.sub}
      WHERE c.publicado = true
        AND (${categoria}::text IS NULL OR c.categoria = ${categoria})
        AND (${busca}::text IS NULL OR c.titulo ILIKE ${'%' + (busca || '') + '%'})
      ORDER BY c.obrigatorio DESC, c.criado_em DESC
    `
  }

  return NextResponse.json({ cursos })
}

// POST /api/cursos — cria curso (admin)
export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user || user.perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await request.json()
  const { titulo, descricao, categoria, carga_horaria, nivel, obrigatorio, thumbnail_url } = body

  if (!titulo || !categoria) {
    return NextResponse.json({ error: 'Título e categoria são obrigatórios' }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const [curso] = await sql`
    INSERT INTO cursos (titulo, descricao, categoria, carga_horaria, nivel, obrigatorio, thumbnail_url, criado_por)
    VALUES (${titulo}, ${descricao}, ${categoria}, ${carga_horaria || 0}, ${nivel || 'basico'}, ${obrigatorio || false}, ${thumbnail_url}, ${user.sub})
    RETURNING *
  `

  return NextResponse.json({ curso }, { status: 201 })
}
