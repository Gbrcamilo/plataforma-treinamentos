import { getSession, requireRole } from '@/lib/auth'
import { ok, unauthorized, forbidden } from '@/lib/response'
import sql from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin', 'gestor'])) return forbidden()

  const [totaisUsuarios] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE ativo = true)  as total_ativos,
      COUNT(*) FILTER (WHERE perfil = 'colaborador') as total_colaboradores,
      COUNT(*) FILTER (WHERE perfil = 'gestor') as total_gestores
    FROM usuarios
  ` as any[]

  const [totaisCursos] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE ativo = true) as total_cursos,
      COUNT(*) FILTER (WHERE obrigatorio = true AND ativo = true) as obrigatorios
    FROM cursos
  ` as any[]

  const [totaisProgressos] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'concluido')    as concluidos,
      COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
      COUNT(*) FILTER (WHERE status = 'nao_iniciado') as nao_iniciados
    FROM progressos
  ` as any[]

  const [totaisCerts] = await sql`
    SELECT COUNT(*) as total FROM certificados
  ` as any[]

  const conformidade = totaisProgressos.concluidos > 0
    ? Math.round((totaisProgressos.concluidos / (Number(totaisProgressos.concluidos) + Number(totaisProgressos.em_andamento) + Number(totaisProgressos.nao_iniciados))) * 100)
    : 0

  const cursosRecentes = await sql`
    SELECT c.titulo, c.categoria, c.obrigatorio,
      COUNT(DISTINCT p.id) as inscritos,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido') as concluidos
    FROM cursos c
    LEFT JOIN progressos p ON p.curso_id = c.id
    WHERE c.ativo = true
    GROUP BY c.id
    ORDER BY c.criado_em DESC
    LIMIT 5
  `

  const alertas = await sql`
    SELECT u.nome, c.titulo as curso,
      EXTRACT(DAY FROM NOW() - p.atualizado_em) as dias_parado
    FROM progressos p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN cursos c ON c.id = p.curso_id
    WHERE p.status != 'concluido'
      AND c.obrigatorio = true
      AND p.atualizado_em < NOW() - INTERVAL '7 days'
    ORDER BY dias_parado DESC
    LIMIT 5
  `

  return ok({
    usuarios: totaisUsuarios,
    cursos: totaisCursos,
    progressos: totaisProgressos,
    certificados: { total: totaisCerts.total },
    conformidade,
    cursosRecentes,
    alertas,
  })
}
