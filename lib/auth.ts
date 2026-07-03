import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'hds-token'

export interface JwtPayload {
  id: number
  nome: string
  email: string
  perfil: 'admin' | 'gestor' | 'colaborador'
  area?: string
}

export async function getSession(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'hds-secret-2026'
    )
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}

export function setCookieName() {
  return COOKIE_NAME
}
