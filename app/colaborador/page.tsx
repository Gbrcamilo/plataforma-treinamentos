'use client'

import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { useAuth } from '@/hooks/useAuth'

type Matricula = {
  id: number
  status: string
  progresso: number
  updated_at: string
  curso_id: number
  titulo: string
  categoria: string
  carga: number
  obrigatorio: boolean
  curso_status: string
}

export default function ColaboradorPage() {
  const { user, loading: authLoading } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/matriculas')
        const data = await res.json()
        setMatriculas(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const indicadores = useMemo(() => {
    const total = matriculas.length
    const concluidos = matriculas.filter(m => m.status === 'concluido').length
    const emAndamento = matriculas.filter(m => m.status === 'em_andamento').length
    const pendentes = total - concluidos - emAndamento
    const progressoMedio = total ? Math.round(matriculas.reduce((acc, item) => acc + (item.progresso || 0), 0) / total) : 0
    return { total, concluidos, emAndamento, pendentes, progressoMedio }
  }, [matriculas])

  if (authLoading || loading) {
    return <div style={{ padding: 32 }}>Carregando área do colaborador...</div>
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="colaborador" userName={user?.nome || 'Colaborador'} activeId={active} onNavigate={(id) => { setActive(id); setSidebarOpen(false) }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title="Meu Aprendizado" onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">
          <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Olá, {user?.nome?.split(' ')[0] || 'colaborador'}</h2>
          <p className="page-subtitle">Acompanhe seus cursos e progresso real</p>

          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-value">{indicadores.total}</div><div className="kpi-label">Cursos</div></div>
            <div className="kpi-card"><div className="kpi-value">{indicadores.emAndamento}</div><div className="kpi-label">Em andamento</div></div>
            <div className="kpi-card"><div className="kpi-value">{indicadores.concluidos}</div><div className="kpi-label">Concluídos</div></div>
            <div className="kpi-card"><div className="kpi-value">{indicadores.progressoMedio}%</div><div className="kpi-label">Progresso médio</div></div>
          </div>

          <div className="courses-grid">
            {matriculas.map(item => (
              <div key={item.id} className="course-card">
                <div className="course-thumb" style={{ background: item.status === 'concluido' ? 'var(--color-success-light)' : 'var(--color-primary-light)' }} />
                <div className="course-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-primary">{item.categoria}</span>
                    <span className={`badge ${item.status === 'concluido' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                  </div>
                  <h3 className="course-title">{item.titulo}</h3>
                  <div className="course-meta">
                    <span>{item.carga}h</span>
                    <span>{item.obrigatorio ? 'Obrigatório' : 'Opcional'}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 'var(--space-3)' }}>
                    <div className="progress-fill" style={{ width: `${item.progresso || 0}%` }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{item.progresso || 0}% concluído</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
