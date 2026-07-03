import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT u.id, u.nome, u.email, u.senha_hash, u.perfil, u.ativo,
             u.area, u.cargo
      FROM usuarios u
      WHERE u.email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const user = users[0]

    if (!user.ativo) {
      return NextResponse.json({ error: 'Usuário inativo. Contate o administrador.' }, { status: 403 })
    }

    const validPassword = await bcrypt.compare(password, user.senha_hash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Atualiza último acesso
    await sql`UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ${user.id}`

    const token = await new SignJWT({
      sub: String(user.id),
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
      area: user.area,
      cargo: user.cargo,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(secret)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        area: user.area,
        cargo: user.cargo,
      },
      redirectTo: `/${user.perfil}`,
    })

    response.cookies.set('hds-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
