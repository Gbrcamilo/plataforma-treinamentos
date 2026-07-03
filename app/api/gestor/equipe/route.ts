// app/api/gestor/equipe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const perfil = request.headers.get('x-user-perfil');
  const gestorId = request.headers.get('x-user-id');

  if (!['admin', 'gestor'].includes(perfil || '')) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  try {
    const equipe = await sql`
      SELECT
        u.id, u.nome, u.email, u.status,
        a.nome as area,
        c.nome as cargo,
        COUNT(m.id) FILTER (WHERE m.status = 'pendente') as pendentes,
        COUNT(m.id) FILTER (WHERE m.status = 'em_andamento') as em_andamento,
        COUNT(m.id) FILTER (WHERE m.status = 'concluido') as concluidos,
        COUNT(m.id) FILTER (
          WHERE m.status IN ('pendente','em_andamento')
          AND m.prazo_conclusao < NOW() + INTERVAL '7 days'
        ) as vencendo_7_dias
      FROM usuarios u
      LEFT JOIN areas a ON u.area_id = a.id
      LEFT JOIN cargos c ON u.cargo_id = c.id
      LEFT JOIN matriculas m ON u.id = m.usuario_id
      WHERE u.gestor_id = ${gestorId} AND u.status = 'ativo'
      GROUP BY u.id, u.nome, u.email, u.status, a.nome, c.nome
      ORDER BY u.nome
    `;

    return NextResponse.json({ equipe });
  } catch (err) {
    console.error('[GESTOR EQUIPE]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
