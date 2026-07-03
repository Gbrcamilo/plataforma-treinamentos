'use client'
import { useState, useEffect } from 'react'

export interface AuthUser {
  id: number
  nome: string
  email: string
  perfil: 'admin' | 'gestor' | 'colaborador'
  area?: string | null
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) throw new Error('Não autenticado')
        return res.json()
      })
      .then((data: AuthUser) => {
        setUser(data)
      })
      .catch((err) => {
        setError(err.message)
        window.location.href = '/login'
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return { user, loading, error, logout }
}
