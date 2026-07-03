import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hds-secret-key-2026'
)

export type JWTPayload = {
  id: number
  nome: string
  email: string
  perfil: 'admin' | 'gestor' | 'colaborador'
  area?: string
  cargo?: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  // Cookie unificado: hds-token
  const token = cookieStore.get('hds-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function requireRole(session: JWTPayload | null, roles: string[]): boolean {
  if (!session) return false
  return roles.includes(session.perfil)
}
