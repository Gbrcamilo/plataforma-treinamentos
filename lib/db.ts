// lib/db.ts
// Conexão com Neon PostgreSQL (serverless - ideal para Vercel)
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Adicione no .env.local ou nas variáveis de ambiente do Vercel.');
}

export const sql = neon(process.env.DATABASE_URL);

// Helper tipado para queries
export async function query<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  return sql(strings, ...values) as Promise<T[]>;
}
