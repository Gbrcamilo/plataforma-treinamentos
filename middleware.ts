import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/sobre']

const ROLE_PATHS: Record<string, string[]> = {
  '/admin':       ['admin'],
  '/gestor':      ['admin', 'gestor'],
  '/colaborador': ['admin', 'gestor', 'colaborador'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Cookie unificado: hds-token
  const token = req.cookies.get('hds-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const session = await verifyToken(token)

  if (!session) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('hds-token', '', { maxAge: 0, path: '/' })
    return res
  }

  for (const [path, roles] of Object.entries(ROLE_PATHS)) {
    if (pathname.startsWith(path)) {
      if (!roles.includes(session.perfil)) {
        return NextResponse.redirect(new URL('/sem-permissao', req.url))
      }
      break
    }
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id',    String(session.id))
  requestHeaders.set('x-user-nome',  session.nome)
  requestHeaders.set('x-user-perfil',session.perfil)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
