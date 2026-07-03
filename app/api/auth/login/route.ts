// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { signToken, comparePassword } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const users = await sql`
      SELECT id, nome, email, senha_hash, perfil, status
      FROM usuarios
      WHERE email = ${email} AND status = 'ativo'
      LIMIT 1
    `;

    if (!users.length) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const user = users[0];
    const valid = await comparePassword(password, user.senha_hash as string);

    if (!valid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Atualiza ultimo_acesso
    await sql`UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ${user.id}`;

    const token = await signToken({
      sub: user.id as string,
      email: user.email as string,
      perfil: user.perfil as 'admin' | 'gestor' | 'colaborador',
      nome: user.nome as string,
    });

    const response = NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
      redirect: `/${user.perfil}`,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[LOGIN]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
