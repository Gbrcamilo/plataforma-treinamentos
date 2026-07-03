import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const [cursos, usuarios, matriculas, trilhas] = await Promise.all([
      query(`SELECT
               COUNT(*) FILTER (WHERE status = 'publicado') AS total_ativos,
               COUNT(*) AS total
             FROM cursos`),
      query(`SELECT
               COUNT(*) FILTER (WHERE status = 'ativo') AS total_ativos
             FROM usuarios`),
      query(`SELECT
               COUNT(*) AS total,
               COUNT(*) FILTER (WHERE status = 'concluido') AS concluidas,
               COUNT(*) FILTER (WHERE status = 'em_andamento') AS em_andamento,
               ROUND(COUNT(*) FILTER (WHERE status = 'concluido') * 100.0 / NULLIF(COUNT(*), 0)) AS taxa_conclusao
             FROM matriculas`),
      query(`SELECT COUNT(*) AS total FROM trilhas WHERE status = 'ativo'`),
    ])

    return NextResponse.json({
      total_cursos: Number(cursos.rows[0].total_ativos),
      total_usuarios: Number(usuarios.rows[0].total_ativos),
      taxa_conclusao: Number(matriculas.rows[0].taxa_conclusao) || 0,
      matriculas_concluidas: Number(matriculas.rows[0].concluidas),
      matriculas_em_andamento: Number(matriculas.rows[0].em_andamento),
      trilhas_ativas: Number(trilhas.rows[0].total),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
