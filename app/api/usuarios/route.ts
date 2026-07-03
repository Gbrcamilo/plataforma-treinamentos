import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'gestor'].includes(session.perfil)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  try {
    const result = await query(
      `SELECT u.id, u.nome, u.email, u.perfil, u.area, u.status,
              u.created_at,
              COUNT(DISTINCT m.id) FILTER (WHERE m.status = 'concluido') AS cursos_concluidos,
              MAX(al.created_at) AS ultimo_acesso
       FROM usuarios u
       LEFT JOIN matriculas m ON m.usuario_id = u.id
       LEFT JOIN activity_log al ON al.usuario_id = u.id
       ${session.perfil === 'gestor' ? 'WHERE u.area = $1' : ''}
       GROUP BY u.id
       ORDER BY u.nome`,
      session.perfil === 'gestor' ? [session.area] : []
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.perfil !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { nome, email, perfil, area, senha } = body

    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.hash(senha || 'Mudar@123', 10)

    const result = await query(
      `INSERT INTO usuarios (nome, email, perfil, area, senha_hash, status)
       VALUES ($1, $2, $3, $4, $5, 'ativo')
       RETURNING id, nome, email, perfil, area, status`,
      [nome, email, perfil, area, hash]
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
