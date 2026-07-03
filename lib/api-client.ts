// Cliente HTTP centralizado para consumo das APIs no frontend

const BASE = ''

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  })

  if (res.status === 401) {
    // Redireciona para login se não autenticado
    window.location.href = '/login'
    throw new Error('Não autenticado')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição')
  }

  return data
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: object; redirectTo: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request<{ user: object }>('/api/auth/me'),
  },

  cursos: {
    listar: (params?: { categoria?: string; busca?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString()
      return request<{ cursos: object[] }>(`/api/cursos${qs ? '?' + qs : ''}`)
    },
    obter: (id: string) => request<{ curso: object }>(`/api/cursos/${id}`),
    criar: (data: object) =>
      request<{ curso: object }>('/api/cursos', { method: 'POST', body: JSON.stringify(data) }),
    atualizar: (id: string, data: object) =>
      request<{ curso: object }>(`/api/cursos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletar: (id: string) =>
      request(`/api/cursos/${id}`, { method: 'DELETE' }),
  },

  trilhas: {
    listar: () => request<{ trilhas: object[] }>('/api/trilhas'),
    criar: (data: object) =>
      request<{ trilha: object }>('/api/trilhas', { method: 'POST', body: JSON.stringify(data) }),
  },

  matriculas: {
    listar: (usuarioId?: string) => {
      const qs = usuarioId ? `?usuario_id=${usuarioId}` : ''
      return request<{ matriculas: object[] }>(`/api/matriculas${qs}`)
    },
    criar: (cursoId: string, usuarioId?: string) =>
      request<{ matricula: object }>('/api/matriculas', {
        method: 'POST',
        body: JSON.stringify({ curso_id: cursoId, usuario_id: usuarioId }),
      }),
  },

  usuarios: {
    listar: (params?: { area?: string; perfil?: string; busca?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString()
      return request<{ usuarios: object[] }>(`/api/usuarios${qs ? '?' + qs : ''}`)
    },
    criar: (data: object) =>
      request<{ usuario: object }>('/api/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  },

  relatorios: {
    geral: () => request<{ stats: object }>('/api/relatorios?tipo=geral'),
    porArea: () => request<{ areas: object[] }>('/api/relatorios?tipo=por_area'),
    porCurso: () => request<{ cursos: object[] }>('/api/relatorios?tipo=por_curso'),
  },
}
