// app/api/cursos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'publicado';
  const categoria = searchParams.get('categoria');
  const obrigatorio = searchParams.get('obrigatorio');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = (page - 1) * limit;

  try {
    const cursos = await sql`
      SELECT
        c.id, c.titulo, c.descricao, c.formato, c.carga_horaria,
        c.obrigatorio, c.status, c.nota_minima, c.validade_dias,
        c.thumbnail_url, c.criado_em,
        cat.nome as categoria_nome, cat.cor as categoria_cor
      FROM cursos c
      LEFT JOIN categorias_curso cat ON c.categoria_id = cat.id
      WHERE c.status = ${status}
      ${categoria ? sql`AND c.categoria_id = ${categoria}` : sql``}
      ${obrigatorio !== null ? sql`AND c.obrigatorio = ${obrigatorio === 'true'}` : sql``}
      ORDER BY c.criado_em DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ total }] = await sql`
      SELECT COUNT(*) as total FROM cursos WHERE status = ${status}
    `;

    return NextResponse.json({
      cursos,
      pagination: { page, limit, total: Number(total), pages: Math.ceil(Number(total) / limit) },
    });
  } catch (err) {
    console.error('[CURSOS GET]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
