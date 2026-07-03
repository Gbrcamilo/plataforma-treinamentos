// app/api/colaborador/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const [resumo] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pendente') as pendentes,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
        COUNT(*) FILTER (WHERE status = 'concluido') as concluidos,
        COUNT(*) FILTER (WHERE certificado_emitido = TRUE) as certificados
      FROM matriculas
      WHERE usuario_id = ${userId}
    `;

    const [horas] = await sql`
      SELECT COALESCE(SUM(c.carga_horaria), 0) as total_horas
      FROM matriculas m
      JOIN cursos c ON m.curso_id = c.id
      WHERE m.usuario_id = ${userId} AND m.status = 'concluido'
    `;

    const vencimentos = await sql`
      SELECT m.id, m.status, m.progresso, m.prazo_conclusao, c.titulo, c.thumbnail_url
      FROM matriculas m
      JOIN cursos c ON m.curso_id = c.id
      WHERE m.usuario_id = ${userId}
      AND m.status IN ('pendente','em_andamento')
      AND m.prazo_conclusao IS NOT NULL
      ORDER BY m.prazo_conclusao ASC
      LIMIT 5
    `;

    return NextResponse.json({
      cursos_pendentes: Number(resumo.pendentes),
      cursos_em_andamento: Number(resumo.em_andamento),
      cursos_concluidos: Number(resumo.concluidos),
      horas_treinadas: Number(horas.total_horas),
      certificados: Number(resumo.certificados),
      proximos_vencimentos: vencimentos,
    });
  } catch (err) {
    console.error('[COLABORADOR DASHBOARD]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
