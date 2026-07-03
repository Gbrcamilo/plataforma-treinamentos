import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession, requireRole } from '@/lib/auth'
import { UsuarioCreateSchema } from '@/lib/validators'
import { ok, err, unauthorized, forbidden } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin', 'gestor'])) return forbidden()

  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca') || ''
  const perfil = searchParams.get('perfil') || ''
  const setor_id = searchParams.get('setor_id')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20
  const offset = (page - 1) * limit

  let whereClause = 'WHERE 1=1'
  const params: any[] = []

  // Gestor só vê sua equipe
  if (session.perfil === 'gestor' && session.setor_id) {
    whereClause += ` AND u.setor_id = ${session.setor_id}`
  } else if (setor_id) {
    whereClause += ` AND u.setor_id = ${parseInt(setor_id)}`
  }

  const users = await sql`
    SELECT
      u.id, u.nome, u.email, u.perfil, u.cargo, u.ativo,
      u.criado_em, s.nome as setor,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido') as concluidos,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'em_andamento') as em_andamento,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'nao_iniciado') as pendentes
    FROM usuarios u
    LEFT JOIN setores s ON s.id = u.setor_id
    LEFT JOIN progressos p ON p.usuario_id = u.id
    WHERE
      (${ session.perfil === 'gestor' && session.setor_id ? session.setor_id : null } IS NULL OR u.setor_id = ${ session.perfil === 'gestor' ? session.setor_id : null })
      AND (${busca} = '' OR u.nome ILIKE ${'%' + busca + '%'} OR u.email ILIKE ${'%' + busca + '%'})
      AND (${perfil} = '' OR u.perfil = ${perfil})
    GROUP BY u.id, s.nome
    ORDER BY u.nome
    LIMIT ${limit} OFFSET ${offset}
  `

  return ok(users)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  const body = await req.json()
  const parsed = UsuarioCreateSchema.safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { nome, email, senha, perfil, cargo, setor_id } = parsed.data

  const existe = await sql`SELECT id FROM usuarios WHERE email = ${email} LIMIT 1`
  if (existe.length > 0) return err('E-mail já cadastrado', 409)

  const senha_hash = await bcrypt.hash(senha, 12)

  const novo = await sql`
    INSERT INTO usuarios (nome, email, senha_hash, perfil, cargo, setor_id)
    VALUES (${nome}, ${email}, ${senha_hash}, ${perfil}, ${cargo || null}, ${setor_id || null})
    RETURNING id, nome, email, perfil, cargo, ativo, criado_em
  `

  return ok(novo[0], 201)
}
