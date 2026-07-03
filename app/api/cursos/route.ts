import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const result = await query(
      `SELECT c.id, c.titulo, c.categoria, c.carga_horaria AS carga,
              c.obrigatorio, c.status,
              COUNT(DISTINCT m.id) AS matriculas,
              ROUND(
                COUNT(DISTINCT m.id) FILTER (WHERE m.status = 'concluido') * 100.0
                / NULLIF(COUNT(DISTINCT m.id), 0)
              ) AS conclusao
       FROM cursos c
       LEFT JOIN matriculas m ON m.curso_id = c.id
       GROUP BY c.id
       ORDER BY c.titulo`
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'gestor'].includes(session.perfil)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { titulo, categoria, carga_horaria, obrigatorio, status } = body
    const result = await query(
      `INSERT INTO cursos (titulo, categoria, carga_horaria, obrigatorio, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, categoria, carga_horaria, obrigatorio ?? false, status ?? 'rascunho']
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar curso' }, { status: 500 })
  }
}
