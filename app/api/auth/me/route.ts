import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hds-secret-key-2026')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('hds-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json({ user: payload })
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
