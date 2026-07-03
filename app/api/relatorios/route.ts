import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

async function getUser(request: NextRequest) {
  const token = request.cookies.get('hds-token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user || user.perfil === 'colaborador') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo') || 'geral'

  if (tipo === 'geral') {
    const [stats] = await sql`
      SELECT
        (SELECT COUNT(*) FROM usuarios WHERE ativo = true) as total_usuarios,
        (SELECT COUNT(*) FROM cursos WHERE publicado = true) as total_cursos,
        (SELECT COUNT(*) FROM matriculas) as total_matriculas,
        (SELECT COUNT(*) FROM matriculas WHERE status = 'concluido') as total_concluidos,
        ROUND(
          (SELECT COUNT(*)::numeric FROM matriculas WHERE status = 'concluido') /
          NULLIF((SELECT COUNT(*)::numeric FROM matriculas), 0) * 100, 1
        ) as taxa_conclusao
    `
    return NextResponse.json({ stats })
  }

  if (tipo === 'por_area') {
    const areas = await sql`
      SELECT u.area,
             COUNT(DISTINCT u.id) as total_usuarios,
             COUNT(DISTINCT m.id) as total_matriculas,
             COUNT(DISTINCT CASE WHEN m.status = 'concluido' THEN m.id END) as concluidos,
             ROUND(AVG(m.progresso), 1) as media_progresso
      FROM usuarios u
      LEFT JOIN matriculas m ON u.id = m.usuario_id
      WHERE u.area IS NOT NULL
      GROUP BY u.area
      ORDER BY u.area
    `
    return NextResponse.json({ areas })
  }

  if (tipo === 'por_curso') {
    const cursos = await sql`
      SELECT c.titulo, c.categoria, c.carga_horaria,
             COUNT(DISTINCT m.id) as total_matriculas,
             COUNT(DISTINCT CASE WHEN m.status = 'concluido' THEN m.id END) as concluidos,
             ROUND(AVG(m.progresso), 1) as media_progresso
      FROM cursos c
      LEFT JOIN matriculas m ON c.id = m.curso_id
      GROUP BY c.id
      ORDER BY total_matriculas DESC
    `
    return NextResponse.json({ cursos })
  }

  return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 })
}
