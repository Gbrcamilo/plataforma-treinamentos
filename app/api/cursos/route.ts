import { NextRequest } from 'next/server'
import { getSession, requireRole } from '@/lib/auth'
import { CursoSchema } from '@/lib/validators'
import { ok, err, unauthorized, forbidden } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()

  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca') || ''
  const categoria = searchParams.get('categoria') || ''
  const obrigatorio = searchParams.get('obrigatorio')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20
  const offset = (page - 1) * limit

  const cursos = await sql`
    SELECT
      c.id, c.titulo, c.descricao, c.categoria, c.carga_horaria,
      c.obrigatorio, c.prazo_dias, c.ativo, c.criado_em,
      COUNT(DISTINCT p.id) as total_inscritos,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'concluido') as total_concluidos
    FROM cursos c
    LEFT JOIN progressos p ON p.curso_id = c.id
    WHERE
      c.ativo = true
      AND (${busca} = '' OR c.titulo ILIKE ${'%' + busca + '%'})
      AND (${categoria} = '' OR c.categoria = ${categoria})
      AND (${obrigatorio} IS NULL OR c.obrigatorio = ${obrigatorio === 'true'})
    GROUP BY c.id
    ORDER BY c.obrigatorio DESC, c.titulo
    LIMIT ${limit} OFFSET ${offset}
  `

  return ok(cursos)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (!requireRole(session, ['admin'])) return forbidden()

  const body = await req.json()
  const parsed = CursoSchema.safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { titulo, descricao, categoria, carga_horaria, obrigatorio, prazo_dias, ativo } = parsed.data

  const novo = await sql`
    INSERT INTO cursos (titulo, descricao, categoria, carga_horaria, obrigatorio, prazo_dias, ativo)
    VALUES (${titulo}, ${descricao || null}, ${categoria}, ${carga_horaria}, ${obrigatorio}, ${prazo_dias || null}, ${ativo})
    RETURNING *
  `
  return ok(novo[0], 201)
}
