'use client'

import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { useAuth } from '@/hooks/useAuth'

type Usuario = {
  id: number
  nome: string
  email: string
  perfil: string
  area: string | null
  status: string
  cursos_concluidos?: number
}

type Matricula = {
  id: number
  status: string
  progresso: number
  updated_at: string
  titulo: string
  categoria: string
  usuario_nome: string
  area: string | null
}

type Curso = {
  id: number
  titulo: string
  categoria: string
  carga: number
  obrigatorio: boolean
  status: string
  matriculas: number
  conclusao: number | null
}

export default function GestorPage() {
  const { user, loading: authLoading } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usuariosRes, matriculasRes, cursosRes] = await Promise.all([
          fetch('/api/usuarios'),
          fetch('/api/matriculas'),
          fetch('/api/cursos'),
        ])
        const [usuariosData, matriculasData, cursosData] = await Promise.all([
          usuariosRes.json(),
          matriculasRes.json(),
          cursosRes.json(),
        ])
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
        setMatriculas(Array.isArray(matriculasData) ? matriculasData : [])
        setCursos(Array.isArray(cursosData) ? cursosData : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const indicadores = useMemo(() => {
    const total = matriculas.length
    const concluidas = matriculas.filter(m => m.status === 'concluido').length
    const emAndamento = matriculas.filter(m => m.status === 'em_andamento').length
    const taxa = total ? Math.round((concluidas * 100) / total) : 0
    return {
      colaboradores: usuarios.filter(u => u.perfil === 'colaborador').length,
      concluidas,
      emAndamento,
      taxa,
    }
  }, [usuarios, matriculas])

  if (authLoading || loading) {
    return <div style={{ padding: 32 }}>Carregando painel do gestor...</div>
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="gestor" userName={user?.nome || 'Gestor'} activeId={active} onNavigate={(id) => { setActive(id); setSidebarOpen(false) }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title="Painel do Gestor" onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">
          {active === 'dashboard' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Equipe de {user?.area || 'sua área'}</h2>
              <p className="page-subtitle">Acompanhamento real do progresso da equipe</p>
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-value">{indicadores.colaboradores}</div><div className="kpi-label">Colaboradores</div></div>
                <div className="kpi-card"><div className="kpi-value">{indicadores.emAndamento}</div><div className="kpi-label">Em andamento</div></div>
                <div className="kpi-card"><div className="kpi-value">{indicadores.concluidas}</div><div className="kpi-label">Concluídas</div></div>
                <div className="kpi-card"><div className="kpi-value">{indicadores.taxa}%</div><div className="kpi-label">Taxa de conclusão</div></div>
              </div>

              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="section-header"><span className="section-title">Matrículas da equipe</span></div>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Colaborador</th><th>Curso</th><th>Categoria</th><th>Status</th><th>Progresso</th><th>Atualizado</th></tr></thead>
                    <tbody>
                      {matriculas.map(m => (
                        <tr key={m.id}>
                          <td>{m.usuario_nome}</td>
                          <td>{m.titulo}</td>
                          <td>{m.categoria}</td>
                          <td><span className={`badge ${m.status === 'concluido' ? 'badge-success' : 'badge-warning'}`}>{m.status}</span></td>
                          <td>{m.progresso}%</td>
                          <td>{new Date(m.updated_at).toLocaleDateString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="section-header"><span className="section-title">Cursos disponíveis</span></div>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Curso</th><th>Categoria</th><th>Carga</th><th>Matrículas</th><th>Conclusão</th></tr></thead>
                    <tbody>
                      {cursos.map(c => (
                        <tr key={c.id}>
                          <td>{c.titulo}</td>
                          <td>{c.categoria}</td>
                          <td>{c.carga}h</td>
                          <td>{c.matriculas}</td>
                          <td>{c.conclusao ?? 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
