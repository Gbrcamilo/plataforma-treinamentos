// app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const perfil = request.headers.get('x-user-perfil');
  if (perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  try {
    const [cursos] = await sql`SELECT COUNT(*) as total FROM cursos WHERE status = 'publicado'`;
    const [usuarios] = await sql`SELECT COUNT(*) as total FROM usuarios WHERE status = 'ativo'`;
    const [matriculas] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'concluido') as concluidas,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
        COUNT(*) as total
      FROM matriculas
    `;
    const [vencendo] = await sql`
      SELECT COUNT(*) as total FROM matriculas
      WHERE status IN ('pendente','em_andamento')
      AND prazo_conclusao BETWEEN NOW() AND NOW() + INTERVAL '30 days'
    `;

    const total = Number(matriculas.total) || 0;
    const concluidas = Number(matriculas.concluidas) || 0;

    return NextResponse.json({
      total_cursos: Number(cursos.total),
      total_usuarios: Number(usuarios.total),
      taxa_conclusao: total > 0 ? Math.round((concluidas / total) * 100) : 0,
      treinamentos_vencendo: Number(vencendo.total),
      matriculas_em_andamento: Number(matriculas.em_andamento),
      matriculas_concluidas: concluidas,
    });
  } catch (err) {
    console.error('[ADMIN DASHBOARD]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
