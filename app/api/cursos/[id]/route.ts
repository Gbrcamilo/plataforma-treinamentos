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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)
  const [curso] = await sql`
    SELECT c.*,
           json_agg(json_build_object(
             'id', a.id, 'titulo', a.titulo, 'tipo', a.tipo,
             'duracao_minutos', a.duracao_minutos, 'ordem', a.ordem
           ) ORDER BY a.ordem) as aulas
    FROM cursos c
    LEFT JOIN aulas a ON c.id = a.curso_id
    WHERE c.id = ${params.id}
    GROUP BY c.id
  `

  if (!curso) return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
  return NextResponse.json({ curso })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(request)
  if (!user || user.perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await request.json()
  const sql = neon(process.env.DATABASE_URL!)

  const [curso] = await sql`
    UPDATE cursos SET
      titulo = COALESCE(${body.titulo}, titulo),
      descricao = COALESCE(${body.descricao}, descricao),
      categoria = COALESCE(${body.categoria}, categoria),
      carga_horaria = COALESCE(${body.carga_horaria}, carga_horaria),
      nivel = COALESCE(${body.nivel}, nivel),
      obrigatorio = COALESCE(${body.obrigatorio}, obrigatorio),
      publicado = COALESCE(${body.publicado}, publicado),
      atualizado_em = NOW()
    WHERE id = ${params.id}
    RETURNING *
  `

  return NextResponse.json({ curso })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(request)
  if (!user || user.perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await sql`DELETE FROM cursos WHERE id = ${params.id}`
  return NextResponse.json({ success: true })
}
