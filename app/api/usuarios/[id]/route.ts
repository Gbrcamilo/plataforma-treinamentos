import { NextRequest } from 'next/server'
import { getSession, requireRole } from '@/lib/auth'
import { UsuarioUpdateSchema } from '@/lib/validators'
import { ok, err, unauthorized, forbidden, notFound } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()

  const id = parseInt(params.id)
  if (isNaN(id)) return err('ID inválido')

  // Colaborador só pode ver a si mesmo
  if (session.perfil === 'colaborador' && session.id !== id) return forbidden()

  const rows = await sql`
    SELECT u.id, u.nome, u.email, u.perfil, u.cargo, u.ativo, u.criado_em,
           s.nome as setor
    FROM usuarios u
    LEFT JOIN setores s ON s.id = u.setor_id
    WHERE u.id = ${id}
    LIMIT 1
  `
  if (!rows[0]) return notFound('Usuário')
  return ok(rows[0])
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin', 'gestor'])) return forbidden()

  const id = parseInt(params.id)
  const body = await req.json()
  const parsed = UsuarioUpdateSchema.safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { nome, email, perfil, cargo, setor_id, ativo } = parsed.data as any

  const updated = await sql`
    UPDATE usuarios SET
      nome      = COALESCE(${nome ?? null}, nome),
      email     = COALESCE(${email ?? null}, email),
      perfil    = COALESCE(${perfil ?? null}, perfil),
      cargo     = COALESCE(${cargo ?? null}, cargo),
      setor_id  = COALESCE(${setor_id ?? null}, setor_id),
      ativo     = COALESCE(${ativo ?? null}, ativo),
      atualizado_em = NOW()
    WHERE id = ${id}
    RETURNING id, nome, email, perfil, cargo, ativo
  `
  if (!updated[0]) return notFound('Usuário')
  return ok(updated[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  const id = parseInt(params.id)
  // Soft delete
  await sql`UPDATE usuarios SET ativo = false WHERE id = ${id}`
  return ok({ message: 'Usuário desativado com sucesso' })
}
