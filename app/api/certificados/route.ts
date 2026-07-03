import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/response'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()

  const { searchParams } = new URL(req.url)
  const usuario_id = searchParams.get('usuario_id')

  const uid = session.perfil === 'colaborador'
    ? session.id
    : parseInt(usuario_id || '0') || null

  const certs = await sql`
    SELECT
      cert.id, cert.codigo, cert.emitido_em, cert.validade_em, cert.carga_horaria,
      u.nome as usuario_nome,
      c.titulo as curso_titulo, c.categoria
    FROM certificados cert
    JOIN usuarios u ON u.id = cert.usuario_id
    JOIN cursos c ON c.id = cert.curso_id
    WHERE (${uid} IS NULL OR cert.usuario_id = ${uid})
    ORDER BY cert.emitido_em DESC
  `
  return ok(certs)
}
