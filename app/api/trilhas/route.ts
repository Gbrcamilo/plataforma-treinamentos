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

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)

  const trilhas = await sql`
    SELECT t.*,
           COUNT(DISTINCT tc.curso_id) as total_cursos,
           json_agg(json_build_object(
             'id', c.id, 'titulo', c.titulo, 'carga_horaria', c.carga_horaria,
             'nivel', c.nivel, 'obrigatorio', c.obrigatorio
           ) ORDER BY tc.ordem) as cursos
    FROM trilhas t
    LEFT JOIN trilha_cursos tc ON t.id = tc.trilha_id
    LEFT JOIN cursos c ON tc.curso_id = c.id
    WHERE t.ativo = true
    GROUP BY t.id
    ORDER BY t.criado_em DESC
  `

  return NextResponse.json({ trilhas })
}

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user || user.perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await request.json()
  const { titulo, descricao, publico_alvo, prazo_dias } = body

  if (!titulo) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const [trilha] = await sql`
    INSERT INTO trilhas (titulo, descricao, publico_alvo, prazo_dias, criado_por)
    VALUES (${titulo}, ${descricao}, ${publico_alvo}, ${prazo_dias || 30}, ${user.sub})
    RETURNING *
  `

  return NextResponse.json({ trilha }, { status: 201 })
}
