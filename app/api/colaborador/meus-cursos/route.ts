import { getSession } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/response'
import sql from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()

  const cursos = await sql`
    SELECT
      c.id, c.titulo, c.categoria, c.carga_horaria, c.obrigatorio, c.prazo_dias,
      COALESCE(p.status, 'nao_iniciado') as status,
      COALESCE(p.progresso_pct, 0) as progresso_pct,
      p.nota, p.concluido_em,
      CASE
        WHEN p.status = 'concluido' THEN 'Concluído'
        WHEN c.prazo_dias IS NOT NULL
          THEN TO_CHAR(p.criado_em + (c.prazo_dias || ' days')::interval, 'DD/MM/YYYY')
        ELSE 'Sem prazo'
      END as prazo_exibicao
    FROM cursos c
    LEFT JOIN progressos p ON p.curso_id = c.id AND p.usuario_id = ${session.id}
    WHERE c.ativo = true
    ORDER BY c.obrigatorio DESC, c.titulo
  `
  return ok(cursos)
}
