import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

const ROLE_PATHS: Record<string, string[]> = {
  '/admin':       ['admin'],
  '/gestor':      ['admin', 'gestor'],
  '/colaborador': ['admin', 'gestor', 'colaborador'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rotas públicas — deixa passar
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Arquivos estáticos
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Raiz redireciona para login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const session = await verifyToken(token)

  if (!session) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('token', '', { maxAge: 0, path: '/' })
    return res
  }

  // Verificar permissão de rota
  for (const [path, roles] of Object.entries(ROLE_PATHS)) {
    if (pathname.startsWith(path)) {
      if (!roles.includes(session.perfil)) {
        return NextResponse.redirect(new URL('/sem-permissao', req.url))
      }
      break
    }
  }

  // Injetar dados do usuário nos headers para uso nos layouts
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id',    String(session.id))
  requestHeaders.set('x-user-nome',  session.nome)
  requestHeaders.set('x-user-perfil',session.perfil)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
