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
      `SELECT t.id, t.titulo, t.status,
              COUNT(DISTINCT tc.curso_id) AS cursos,
              COUNT(DISTINCT mt.usuario_id) AS usuarios,
              ROUND(
                AVG(
                  (SELECT COUNT(*) FILTER (WHERE m2.status = 'concluido') * 100.0
                   / NULLIF(COUNT(*), 0)
                   FROM matriculas m2
                   WHERE m2.usuario_id = mt.usuario_id
                     AND m2.curso_id IN (SELECT curso_id FROM trilha_cursos WHERE trilha_id = t.id))
                )
              ) AS progresso
       FROM trilhas t
       LEFT JOIN trilha_cursos tc ON tc.trilha_id = t.id
       LEFT JOIN matriculas_trilhas mt ON mt.trilha_id = t.id
       GROUP BY t.id
       ORDER BY t.titulo`
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
