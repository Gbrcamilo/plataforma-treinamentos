import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

async function getUser(request: NextRequest) {
  const token = request.cookies.get('hds-token')?.value
  if (!token) return null
  try { const { payload } = await jwtVerify(token, secret); return payload } catch { return null }
}

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const usuarioId = searchParams.get('usuario_id')

  const targetId = (user.perfil === 'admin' || user.perfil === 'gestor') && usuarioId ? usuarioId : user.sub

  const certs = await sql`
    SELECT m.id, m.usuario_id, m.curso_id, m.concluido_em,
           c.titulo as curso_titulo, c.carga_horaria, c.categoria,
           u.nome as usuario_nome, u.cargo, u.area,
           CONCAT('CERT-', UPPER(SUBSTRING(MD5(CONCAT(m.usuario_id::text, m.curso_id::text)), 1, 8))) as codigo
    FROM matriculas m
    JOIN cursos c ON m.curso_id = c.id
    JOIN usuarios u ON m.usuario_id = u.id
    WHERE m.status = 'concluido'
      AND m.usuario_id::text = ${targetId}
      AND m.concluido_em IS NOT NULL
    ORDER BY m.concluido_em DESC
  `

  return NextResponse.json({ certificados: certs })
}
