import { NextRequest } from 'next/server'
import { getSession, requireRole } from '@/lib/auth'
import { TrilhaSchema } from '@/lib/validators'
import { ok, err, unauthorized, forbidden } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()

  const trilhas = await sql`
    SELECT
      t.id, t.titulo, t.descricao, t.obrigatorio, t.prazo_dias, t.ativo,
      COUNT(DISTINCT tc.curso_id) as total_cursos,
      COUNT(DISTINCT p.usuario_id) as total_inscritos
    FROM trilhas t
    LEFT JOIN trilha_cursos tc ON tc.trilha_id = t.id
    LEFT JOIN progressos p ON p.curso_id = tc.curso_id
    WHERE t.ativo = true
    GROUP BY t.id
    ORDER BY t.obrigatorio DESC, t.titulo
  `
  return ok(trilhas)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  const body = await req.json()
  const parsed = TrilhaSchema.safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { titulo, descricao, obrigatorio, prazo_dias, curso_ids } = parsed.data

  const nova = await sql`
    INSERT INTO trilhas (titulo, descricao, obrigatorio, prazo_dias)
    VALUES (${titulo}, ${descricao || null}, ${obrigatorio}, ${prazo_dias || null})
    RETURNING *
  `
  const trilha = nova[0] as any

  // Associar cursos
  for (let i = 0; i < curso_ids.length; i++) {
    await sql`
      INSERT INTO trilha_cursos (trilha_id, curso_id, ordem)
      VALUES (${trilha.id}, ${curso_ids[i]}, ${i + 1})
      ON CONFLICT DO NOTHING
    `
  }

  return ok(trilha, 201)
}
