import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export function unauthorized() {
  return err('Não autorizado. Faça login novamente.', 401)
}

export function forbidden() {
  return err('Sem permissão para esta ação.', 403)
}

export function notFound(entity = 'Recurso') {
  return err(`${entity} não encontrado.`, 404)
}
