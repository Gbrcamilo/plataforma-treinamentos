import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { ProgressoSchema } from '@/lib/validators'
import { ok, err, unauthorized } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()

  const { searchParams } = new URL(req.url)
  const usuario_id = parseInt(searchParams.get('usuario_id') || String(session.id))
  const curso_id = searchParams.get('curso_id')

  // Colaborador só vê seu próprio progresso
  const uid = session.perfil === 'colaborador' ? session.id : usuario_id

  const rows = await sql`
    SELECT
      p.*,
      c.titulo as curso_titulo,
      c.categoria,
      c.carga_horaria,
      c.obrigatorio
    FROM progressos p
    JOIN cursos c ON c.id = p.curso_id
    WHERE p.usuario_id = ${uid}
    ${curso_id ? sql`AND p.curso_id = ${parseInt(curso_id)}` : sql``}
    ORDER BY p.atualizado_em DESC
  `
  return ok(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()

  const body = await req.json()
  const parsed = ProgressoSchema.safeParse(body)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { curso_id, status, progresso_pct, nota } = parsed.data
  const usuario_id = session.perfil === 'colaborador' ? session.id : (parsed.data.usuario_id || session.id)

  const existing = await sql`
    SELECT id FROM progressos
    WHERE usuario_id = ${usuario_id} AND curso_id = ${curso_id}
    LIMIT 1
  `

  let result
  if (existing.length > 0) {
    result = await sql`
      UPDATE progressos SET
        status = ${status},
        progresso_pct = ${progresso_pct},
        nota = ${nota || null},
        concluido_em = ${status === 'concluido' ? sql`NOW()` : sql`concluido_em`},
        atualizado_em = NOW()
      WHERE usuario_id = ${usuario_id} AND curso_id = ${curso_id}
      RETURNING *
    `
  } else {
    result = await sql`
      INSERT INTO progressos (usuario_id, curso_id, status, progresso_pct, nota)
      VALUES (${usuario_id}, ${curso_id}, ${status}, ${progresso_pct}, ${nota || null})
      RETURNING *
    `
  }

  // Emitir certificado automaticamente se concluído
  if (status === 'concluido') {
    const curso = await sql`SELECT titulo, carga_horaria FROM cursos WHERE id = ${curso_id} LIMIT 1`
    const c = curso[0] as any
    if (c) {
      const codigo = `CERT-${new Date().getFullYear()}-${String(usuario_id).padStart(4,'0')}-${String(curso_id).padStart(4,'0')}`
      await sql`
        INSERT INTO certificados (usuario_id, curso_id, codigo, carga_horaria)
        VALUES (${usuario_id}, ${curso_id}, ${codigo}, ${c.carga_horaria})
        ON CONFLICT (usuario_id, curso_id) DO NOTHING
      `
    }
  }

  return ok(result[0])
}
