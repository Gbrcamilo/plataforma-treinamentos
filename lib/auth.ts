// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-troque-em-producao-minimo-32-chars'
);

export type JWTPayload = {
  sub: string;
  email: string;
  perfil: 'admin' | 'gestor' | 'colaborador';
  nome: string;
  org_id: string;
};

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as JWTPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
