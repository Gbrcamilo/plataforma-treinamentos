import { NextRequest } from 'next/server'
import { getSession, requireRole } from '@/lib/auth'
import { CursoSchema } from '@/lib/validators'
import { ok, err, unauthorized, forbidden, notFound } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()

  const id = parseInt(params.id)
  const rows = await sql`
    SELECT c.*,
      COUNT(DISTINCT p.id) as total_inscritos,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido') as total_concluidos,
      ROUND(AVG(p.nota) FILTER (WHERE p.nota IS NOT NULL), 1) as media_nota
    FROM cursos c
    LEFT JOIN progressos p ON p.curso_id = c.id
    WHERE c.id = ${id}
    GROUP BY c.id
  `
  if (!rows[0]) return notFound('Curso')
  return ok(rows[0])
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  const id = parseInt(params.id)
  const body = await req.json()
  const parsed = CursoSchema.partial().safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const d = parsed.data as any
  const updated = await sql`
    UPDATE cursos SET
      titulo        = COALESCE(${d.titulo ?? null}, titulo),
      descricao     = COALESCE(${d.descricao ?? null}, descricao),
      categoria     = COALESCE(${d.categoria ?? null}, categoria),
      carga_horaria = COALESCE(${d.carga_horaria ?? null}, carga_horaria),
      obrigatorio   = COALESCE(${d.obrigatorio ?? null}, obrigatorio),
      prazo_dias    = COALESCE(${d.prazo_dias ?? null}, prazo_dias),
      ativo         = COALESCE(${d.ativo ?? null}, ativo),
      atualizado_em = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  if (!updated[0]) return notFound('Curso')
  return ok(updated[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  await sql`UPDATE cursos SET ativo = false WHERE id = ${parseInt(params.id)}`
  return ok({ message: 'Curso desativado' })
}
