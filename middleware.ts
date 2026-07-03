import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/api/auth/login']
const COOKIE_NAME = 'hds-token'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'hds-secret-2026'
    )
    const { payload } = await jwtVerify(token, secret)
    const perfil = payload.perfil as string

    // Proteção por perfil
    if (pathname.startsWith('/admin') && perfil !== 'admin') {
      return NextResponse.redirect(new URL('/sem-permissao', request.url))
    }
    if (pathname.startsWith('/gestor') && !['admin', 'gestor'].includes(perfil)) {
      return NextResponse.redirect(new URL('/sem-permissao', request.url))
    }

    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/login).*)',
  ],
}
