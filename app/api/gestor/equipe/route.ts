import { getSession, requireRole } from '@/lib/auth'
import { ok, unauthorized, forbidden } from '@/lib/response'
import sql from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin', 'gestor'])) return forbidden()

  const setor_id = session.perfil === 'gestor' ? session.setor_id : null

  const equipe = await sql`
    SELECT
      u.id, u.nome, u.cargo, u.email,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido')    as concluidos,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'em_andamento') as em_andamento,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'nao_iniciado') as pendentes,
      COUNT(DISTINCT cert.id) as certificados,
      CASE
        WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.status != 'concluido' AND c.obrigatorio = true) > 0
          AND MAX(EXTRACT(DAY FROM NOW() - p.atualizado_em)) > 14 THEN 'critico'
        WHEN COUNT(DISTINCT p.id) FILTER (WHERE c.obrigatorio = true AND p.status != 'concluido') > 0
          THEN 'atencao'
        ELSE 'em_dia'
      END as status_conformidade
    FROM usuarios u
    LEFT JOIN progressos p ON p.usuario_id = u.id
    LEFT JOIN cursos c ON c.id = p.curso_id
    LEFT JOIN certificados cert ON cert.usuario_id = u.id
    WHERE u.perfil = 'colaborador'
      AND u.ativo = true
      AND (${setor_id} IS NULL OR u.setor_id = ${setor_id})
    GROUP BY u.id
    ORDER BY u.nome
  `
  return ok(equipe)
}
