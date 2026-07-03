import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { LoginSchema } from '@/lib/validators'
import { ok, err } from '@/lib/response'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.errors[0].message)

    const { email, senha } = parsed.data

    const users = await sql`
      SELECT u.id, u.nome, u.email, u.senha_hash, u.perfil, u.setor_id, u.ativo
      FROM usuarios u
      WHERE u.email = ${email}
      LIMIT 1
    `

    const user = users[0] as any
    if (!user) return err('Credenciais inválidas', 401)
    if (!user.ativo) return err('Usuário inativo. Contate o administrador.', 403)

    const senhaOk = await bcrypt.compare(senha, user.senha_hash)
    if (!senhaOk) return err('Credenciais inválidas', 401)

    const token = await signToken({
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      setor_id: user.setor_id,
    })

    const res = ok({
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      rota: `/${user.perfil}`,
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8h
      path: '/',
    })

    return res
  } catch (e) {
    console.error('[LOGIN]', e)
    return err('Erro interno do servidor', 500)
  }
}
