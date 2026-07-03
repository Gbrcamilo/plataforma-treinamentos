'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  sub: string
  email: string
  nome: string
  perfil: 'admin' | 'gestor' | 'colaborador'
  area?: string
  cargo?: string
}

export function useAuth(requiredPerfil?: AuthUser['perfil'] | AuthUser['perfil'][]) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) {
          router.replace('/login')
          return
        }
        const u = data.user as AuthUser
        if (requiredPerfil) {
          const allowed = Array.isArray(requiredPerfil) ? requiredPerfil : [requiredPerfil]
          if (!allowed.includes(u.perfil)) {
            router.replace(`/${u.perfil}`)
            return
          }
        }
        setUser(u)
        setLoading(false)
      })
      .catch(() => router.replace('/login'))
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.replace('/login')
  }, [router])

  return { user, loading, logout }
}
