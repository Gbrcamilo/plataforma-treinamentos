// middleware.ts
// Proteção de rotas por perfil
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-troque-em-producao-minimo-32-chars'
);

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/logout'];

// Rotas por perfil
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin': ['admin'],
  '/gestor': ['admin', 'gestor'],
  '/colaborador': ['admin', 'gestor', 'colaborador'],
  '/api/admin': ['admin'],
  '/api/gestor': ['admin', 'gestor'],
  '/api/colaborador': ['admin', 'gestor', 'colaborador'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Libera rotas públicas
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Verifica token
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const perfil = payload.perfil as string;

    // Verifica permissão por rota
    for (const [route, perfisPermitidos] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route) && !perfisPermitidos.includes(perfil)) {
        return NextResponse.redirect(new URL('/sem-permissao', request.url));
      }
    }

    // Injeta dados do usuário no header para as API Routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    requestHeaders.set('x-user-perfil', perfil);
    requestHeaders.set('x-user-email', payload.email as string);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.png|.*\.jpg|.*\.svg).*)',
  ],
};
