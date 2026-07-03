import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

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

// GET /api/usuarios — admin e gestor
export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user || user.perfil === 'colaborador') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const perfil = searchParams.get('perfil')
  const busca = searchParams.get('busca')

  const usuarios = await sql`
    SELECT id, nome, email, perfil, area, cargo, ativo, ultimo_acesso, criado_em
    FROM usuarios
    WHERE (${area}::text IS NULL OR area = ${area})
      AND (${perfil}::text IS NULL OR perfil = ${perfil})
      AND (${busca}::text IS NULL OR nome ILIKE ${'%' + (busca || '') + '%'})
    ORDER BY nome
  `

  return NextResponse.json({ usuarios })
}

// POST /api/usuarios — cria usuário (admin)
export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user || user.perfil !== 'admin') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await request.json()
  const { nome, email, senha, perfil, area, cargo } = body

  if (!nome || !email || !senha) {
    return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  const existing = await sql`SELECT id FROM usuarios WHERE email = ${email}`
  if (existing.length > 0) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const senha_hash = await bcrypt.hash(senha, 12)

  const [novoUsuario] = await sql`
    INSERT INTO usuarios (nome, email, senha_hash, perfil, area, cargo)
    VALUES (${nome}, ${email}, ${senha_hash}, ${perfil || 'colaborador'}, ${area}, ${cargo})
    RETURNING id, nome, email, perfil, area, cargo, ativo, criado_em
  `

  return NextResponse.json({ usuario: novoUsuario }, { status: 201 })
}
