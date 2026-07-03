// lib/db.ts — Conexão Neon PostgreSQL serverless
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Configure no .env.local ou nas variáveis do Vercel.');
}

export const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL);

/** Log de auditoria — chama sem await nos handlers para não bloquear response */
export async function auditLog(params: {
  org_id?: string;
  usuario_id?: string;
  acao: string;
  entidade?: string;
  entidade_id?: string;
  descricao?: string;
  ip?: string;
  user_agent?: string;
  dados_antes?: unknown;
  dados_depois?: unknown;
}) {
  try {
    await sql`
      INSERT INTO audit_logs (org_id, usuario_id, acao, entidade, entidade_id, descricao, ip_address, user_agent, dados_antes, dados_depois)
      VALUES (
        ${params.org_id ?? null},
        ${params.usuario_id ?? null},
        ${params.acao},
        ${params.entidade ?? null},
        ${params.entidade_id ?? null},
        ${params.descricao ?? null},
        ${params.ip ?? null},
        ${params.user_agent ?? null},
        ${params.dados_antes ? JSON.stringify(params.dados_antes) : null},
        ${params.dados_depois ? JSON.stringify(params.dados_depois) : null}
      )
    `;
  } catch { /* audit nunca deve quebrar o fluxo principal */ }
}
