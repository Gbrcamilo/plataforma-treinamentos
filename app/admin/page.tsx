'use client'

import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { useAuth } from '@/hooks/useAuth'

type Usuario = {
  id: number
  nome: string
  email: string
  perfil: 'admin' | 'gestor' | 'colaborador'
  area: string | null
  status: string
  cursos_concluidos?: number
  ultimo_acesso?: string | null
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

type Trilha = {
  id: number
  titulo: string
  status: string
  cursos: number
  usuarios: number
  progresso: number | null
}

type DashboardStats = {
  total_cursos: number
  total_usuarios: number
  taxa_conclusao: number
  matriculas_concluidas: number
  matriculas_em_andamento: number
  trilhas_ativas: number
}

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const icons: Record<string, string> = {
    chart: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] || icons.chart }} />
  )
}

const KpiCard = ({ value, label, icon, color }: { value: string | number; label: string; icon: string; color: string }) => (
  <div className="kpi-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
      <div className="kpi-icon" style={{ background: color + '18', color }}>
        <Icon name={icon} size={20} />
      </div>
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
  </div>
)

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, usuariosRes, cursosRes, trilhasRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/usuarios'),
          fetch('/api/cursos'),
          fetch('/api/trilhas'),
        ])

        const [statsData, usuariosData, cursosData, trilhasData] = await Promise.all([
          statsRes.json(),
          usuariosRes.json(),
          cursosRes.json(),
          trilhasRes.json(),
        ])

        setStats(statsData)
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
        setCursos(Array.isArray(cursosData) ? cursosData : [])
        setTrilhas(Array.isArray(trilhasData) ? trilhasData : [])
      } finally {
        setDataLoading(false)
      }
    }

    load()
  }, [])

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  })

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u =>
      (filterStatus === 'todos' || u.status === filterStatus) &&
      (u.nome.toLowerCase().includes(search.toLowerCase()) || (u.area || '').toLowerCase().includes(search.toLowerCase()))
    )
  }, [usuarios, filterStatus, search])

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    usuarios: 'Gestão de Usuários',
    cursos: 'Catálogo de Cursos',
    trilhas: 'Trilhas de Aprendizagem',
    relatorios: 'Relatórios',
    configuracoes: 'Configurações',
  }

  if (authLoading || dataLoading) {
    return <div style={{ padding: 32 }}>Carregando painel...</div>
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="admin" userName={user?.nome || 'Administrador'} activeId={active} onNavigate={(id) => { setActive(id); setSidebarOpen(false) }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title={pageTitles[active] || active} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">
          {active === 'dashboard' && (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Visão Geral da Plataforma</h2>
                  <p className="page-subtitle" style={{ marginBottom: 0, textTransform: 'capitalize' }}>{today}</p>
                </div>
              </div>

              <div className="kpi-grid">
                <KpiCard value={stats?.total_cursos || 0} label="Cursos Ativos" icon="book" color="var(--color-primary)" />
                <KpiCard value={stats?.total_usuarios || 0} label="Usuários Ativos" icon="users" color="var(--color-info)" />
                <KpiCard value={`${stats?.taxa_conclusao || 0}%`} label="Taxa de Conclusão" icon="chart" color="var(--color-success)" />
                <KpiCard value={stats?.matriculas_em_andamento || 0} label="Em Andamento" icon="play" color="var(--color-gestor)" />
                <KpiCard value={stats?.matriculas_concluidas || 0} label="Matrículas Concluídas" icon="award" color="var(--color-admin)" />
                <KpiCard value={stats?.trilhas_ativas || 0} label="Trilhas Ativas" icon="map" color="var(--color-warning)" />
              </div>

              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="section-header">
                  <span className="section-title">Cursos em Destaque</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{cursos.length} cursos</span>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Curso</th>
                        <th>Categoria</th>
                        <th>Carga</th>
                        <th>Matrículas</th>
                        <th>Conclusão</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursos.map(c => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{c.titulo}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.obrigatorio ? '• Obrigatório' : '• Opcional'}</div>
                          </td>
                          <td><span className="badge badge-primary">{c.categoria}</span></td>
                          <td>{c.carga}h</td>
                          <td>{c.matriculas}</td>
                          <td>{c.conclusao ?? 0}%</td>
                          <td><span className={`badge ${c.status === 'publicado' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="section-grid">
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Usuários Recentes</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {usuarios.slice(0, 5).map(u => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.nome}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                        </div>
                        <span className={`badge ${u.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Trilhas</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {trilhas.map(t => (
                      <div key={t.id} style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-divider)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <strong>{t.titulo}</strong>
                          <span className={`badge ${t.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.cursos} cursos · {t.usuarios} inscritos · {t.progresso ?? 0}% progresso</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {active === 'usuarios' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Usuários</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{usuarios.length} usuários cadastrados</p>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: '1 1 240px' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)' }}><Icon name="search" size={16} /></span>
                    <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Buscar por nome ou área..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  {['todos', 'ativo', 'inativo'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'} btn-sm`} style={{ textTransform: 'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Usuário</th><th>Perfil</th><th>Área</th><th>Cursos</th><th>Último Acesso</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{u.nome}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                          </td>
                          <td><span className="badge badge-primary">{u.perfil}</span></td>
                          <td>{u.area || '-'}</td>
                          <td>{u.cursos_concluidos || 0}</td>
                          <td>{u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleDateString('pt-BR') : '-'}</td>
                          <td><span className={`badge ${u.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {active === 'cursos' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Catálogo de Cursos</h2>
              <p className="page-subtitle">{cursos.length} cursos cadastrados</p>
              <div className="courses-grid">
                {cursos.map(c => (
                  <div key={c.id} className="course-card">
                    <div className="course-thumb" style={{ background: c.status === 'rascunho' ? 'var(--color-surface-offset)' : 'var(--color-primary-light)' }}>
                      <div style={{ color: 'var(--color-primary)' }}><Icon name="book" size={40} /></div>
                    </div>
                    <div className="course-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <span className="badge badge-primary">{c.categoria}</span>
                        <span className={`badge ${c.status === 'publicado' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                      </div>
                      <h3 className="course-title">{c.titulo}</h3>
                      <div className="course-meta">
                        <span><Icon name="clock" size={12} /> {c.carga}h</span>
                        <span><Icon name="users" size={12} /> {c.matriculas} inscritos</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{c.conclusao ?? 0}% concluído</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {active === 'trilhas' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Trilhas de Aprendizagem</h2>
              <p className="page-subtitle">{trilhas.length} trilhas registradas</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {trilhas.map(t => (
                  <div key={t.id} className="card" style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{t.titulo}</h3>
                      <span className={`badge ${t.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.cursos} cursos · {t.usuarios} inscritos · {t.progresso ?? 0}% progresso</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
