import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    let sql: string
    let params: unknown[]

    if (session.perfil === 'colaborador') {
      sql = `SELECT m.id, m.status, m.progresso, m.updated_at,
                    c.id AS curso_id, c.titulo, c.categoria, c.carga_horaria AS carga,
                    c.obrigatorio, c.status AS curso_status
             FROM matriculas m
             JOIN cursos c ON c.id = m.curso_id
             WHERE m.usuario_id = $1
             ORDER BY m.updated_at DESC`
      params = [session.id]
    } else {
      sql = `SELECT m.id, m.status, m.progresso, m.updated_at,
                    c.titulo, c.categoria,
                    u.nome AS usuario_nome, u.area
             FROM matriculas m
             JOIN cursos c ON c.id = m.curso_id
             JOIN usuarios u ON u.id = m.usuario_id
             ${session.perfil === 'gestor' ? 'WHERE u.area = $1' : ''}
             ORDER BY m.updated_at DESC
             LIMIT 100`
      params = session.perfil === 'gestor' ? [session.area] : []
    }

    const result = await query(sql, params)
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const cursoId = body.curso_id
    const result = await query(
      `INSERT INTO matriculas (usuario_id, curso_id, status, progresso)
       VALUES ($1, $2, 'em_andamento', 0)
       ON CONFLICT (usuario_id, curso_id) DO NOTHING
       RETURNING *`,
      [session.id, cursoId]
    )
    return NextResponse.json(result.rows[0] ?? { info: 'Já matriculado' }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao matricular' }, { status: 500 })
  }
}
