import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

async function getUser(request: NextRequest) {
  const token = request.cookies.get('hds-token')?.value
  if (!token) return null
  try { const { payload } = await jwtVerify(token, secret); return payload } catch { return null }
}

export async function GET(request: NextRequest, { params }: { params: { aulaId: string } }) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const sql = neon(process.env.DATABASE_URL!)
  const questoes = await sql`
    SELECT q.id, q.enunciado, q.tipo, q.pontos,
           json_agg(json_build_object('id', a.id, 'texto', a.texto) ORDER BY a.id) as alternativas
    FROM questoes q
    JOIN alternativas a ON q.id = a.questao_id
    WHERE q.aula_id = ${params.aulaId}
    GROUP BY q.id
    ORDER BY q.ordem
  `

  return NextResponse.json({ questoes })
}

export async function POST(request: NextRequest, { params }: { params: { aulaId: string } }) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { respostas } = await request.json() // { questaoId: alternativaId }
  const sql = neon(process.env.DATABASE_URL!)

  const questoes = await sql`
    SELECT q.id, q.pontos,
           a.id as alt_correta_id
    FROM questoes q
    JOIN alternativas a ON q.id = a.questao_id AND a.correta = true
    WHERE q.aula_id = ${params.aulaId}
  `

  let acertos = 0
  let totalPontos = 0
  let pontosObtidos = 0

  const detalhes = questoes.map((q: { id: string; pontos: number; alt_correta_id: string }) => {
    totalPontos += q.pontos
    const acertou = respostas[q.id] === q.alt_correta_id
    if (acertou) { acertos++; pontosObtidos += q.pontos }
    return { questao_id: q.id, acertou, correta: q.alt_correta_id, respondida: respostas[q.id] }
  })

  const nota = totalPontos > 0 ? Math.round((pontosObtidos / totalPontos) * 100) : 0

  // Salva tentativa
  await sql`
    INSERT INTO tentativas_avaliacao (usuario_id, aula_id, nota, acertos, total_questoes)
    VALUES (${user.sub}, ${params.aulaId}, ${nota}, ${acertos}, ${questoes.length})
  `

  return NextResponse.json({ nota, acertos, total: questoes.length, detalhes, aprovado: nota >= 60 })
}
