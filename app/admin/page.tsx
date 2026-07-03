'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import type { DashboardAdmin } from '@/lib/types'

function KpiCard({ value, label, icon, color, trend, trendLabel }: {
  value: number | string; label: string; icon: string;
  color: string; trend?: 'up' | 'down' | 'neutral'; trendLabel?: string
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: color + '20' }}>
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {trendLabel && (
        <div className={`kpi-trend ${trend || 'neutral'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
        </div>
      )}
    </div>
  )
}

const MOCK_CURSOS = [
  { id: 1, titulo: 'Integração e Onboarding', categoria: 'Onboarding', carga: 4, obrigatorio: true, status: 'publicado', matriculas: 142 },
  { id: 2, titulo: 'LGPD e Proteção de Dados', categoria: 'Compliance', carga: 8, obrigatorio: true, status: 'publicado', matriculas: 98 },
  { id: 3, titulo: 'NR-32 Segurança Hospitalar', categoria: 'Segurança', carga: 16, obrigatorio: true, status: 'publicado', matriculas: 67 },
  { id: 4, titulo: 'Prontuário Eletrônico Soul MV', categoria: 'Técnico', carga: 12, obrigatorio: false, status: 'publicado', matriculas: 45 },
  { id: 5, titulo: 'Liderança e Gestão de Equipes', categoria: 'Gestão', carga: 20, obrigatorio: false, status: 'rascunho', matriculas: 0 },
]

const MOCK_USERS = [
  { nome: 'Ana Souza', email: 'ana@hospital.com', perfil: 'gestor', area: 'Tecnologia', status: 'ativo', ultimo_acesso: '03/07/2026' },
  { nome: 'Carlos Lima', email: 'carlos@hospital.com', perfil: 'colaborador', area: 'Assistência', status: 'ativo', ultimo_acesso: '02/07/2026' },
  { nome: 'Beatriz Melo', email: 'beatriz@hospital.com', perfil: 'colaborador', area: 'RH', status: 'ativo', ultimo_acesso: '01/07/2026' },
  { nome: 'Diego Faria', email: 'diego@hospital.com', perfil: 'gestor', area: 'Administrativo', status: 'ativo', ultimo_acesso: '03/07/2026' },
  { nome: 'Fernanda Reis', email: 'fernanda@hospital.com', perfil: 'colaborador', area: 'Segurança', status: 'inativo', ultimo_acesso: '15/06/2026' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [kpis, setKpis] = useState<DashboardAdmin | null>(null)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(data => setKpis(data))
      .catch(() => setKpis({
        total_cursos: 18, total_usuarios: 234,
        taxa_conclusao: 76, treinamentos_vencendo: 12,
        matriculas_em_andamento: 89, matriculas_concluidas: 312
      }))
  }, [])

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard', usuarios: 'Usuários', cursos: 'Cursos',
    trilhas: 'Trilhas de Aprendizagem', avaliacoes: 'Avaliações',
    certificados: 'Certificados', relatorios: 'Relatórios',
    notificacoes: 'Notificações', configuracoes: 'Configurações',
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="admin" userName="Administrador" activeId={active}
        onNavigate={setActive} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title={pageTitles[active] || active} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">

          {active === 'dashboard' && (
            <>
              <h2 className="page-title">Visão Geral</h2>
              <p className="page-subtitle">Resumo da plataforma · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>

              <div className="kpi-grid">
                <KpiCard value={kpis?.total_cursos ?? '—'} label="Cursos Ativos" icon="📚" color="var(--color-primary)" trend="up" trendLabel="+3 este mês" />
                <KpiCard value={kpis?.total_usuarios ?? '—'} label="Usuários Ativos" icon="👥" color="var(--color-info)" trend="up" trendLabel="+18 este mês" />
                <KpiCard value={kpis ? `${kpis.taxa_conclusao}%` : '—'} label="Taxa de Conclusão" icon="✅" color="var(--color-success)" trend="up" trendLabel="+4% vs mês anterior" />
                <KpiCard value={kpis?.treinamentos_vencendo ?? '—'} label="Vencendo em 30 dias" icon="⏰" color="var(--color-warning)" trend="down" trendLabel="Atenção necessária" />
                <KpiCard value={kpis?.matriculas_em_andamento ?? '—'} label="Em Andamento" icon="▶" color="var(--color-gestor)" trend="neutral" trendLabel="Estável" />
                <KpiCard value={kpis?.matriculas_concluidas ?? '—'} label="Matrículas Concluídas" icon="🏆" color="var(--color-admin)" trend="up" trendLabel="+28 esta semana" />
              </div>

              <div className="section-grid">
                {/* Cursos recentes */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Cursos</span>
                    <button className="btn btn-sm btn-primary" onClick={() => setActive('cursos')}>Ver todos</button>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Curso</th><th>Categoria</th><th>Matrículas</th><th>Status</th></tr></thead>
                      <tbody>
                        {MOCK_CURSOS.map(c => (
                          <tr key={c.id}>
                            <td><div style={{ fontWeight: 500 }}>{c.titulo}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.carga}h · {c.obrigatorio ? 'Obrigatório' : 'Opcional'}</div></td>
                            <td><span className="badge badge-primary">{c.categoria}</span></td>
                            <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{c.matriculas}</td>
                            <td><span className={`badge ${c.status === 'publicado' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Usuários recentes */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Usuários</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setActive('usuarios')}>Gerenciar</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {MOCK_USERS.map(u => (
                      <div key={u.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--color-divider)' }}>
                        <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem',
                          background: u.perfil === 'gestor' ? 'var(--color-gestor)' : 'var(--color-primary)' }}>
                          {u.nome.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{u.nome}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.area}</div>
                        </div>
                        <span className={`badge ${u.perfil === 'gestor' ? 'badge-gestor' : 'badge-primary'}`}>{u.perfil}</span>
                        <span className={`badge ${u.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações rápidas */}
              <div className="card">
                <div className="section-header"><span className="section-title">Ações Rápidas</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {[
                    { icon: '➕', label: 'Novo Curso', action: () => setActive('cursos') },
                    { icon: '👤', label: 'Novo Usuário', action: () => setActive('usuarios') },
                    { icon: '🗺', label: 'Nova Trilha', action: () => setActive('trilhas') },
                    { icon: '📊', label: 'Exportar Relatório', action: () => setActive('relatorios') },
                    { icon: '🔔', label: 'Enviar Notificação', action: () => setActive('notificacoes') },
                    { icon: '🏆', label: 'Emitir Certificados', action: () => setActive('certificados') },
                  ].map(a => (
                    <button key={a.label} onClick={a.action}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px',
                        background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition)',
                        fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)',
                        textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text)'; }}>
                      <span style={{ fontSize: '1.25rem' }}>{a.icon}</span> {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {active !== 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🚧</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{pageTitles[active]}</h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '36ch', textAlign: 'center' }}>Esta seção está em desenvolvimento. Volte em breve!</p>
              <button className="btn btn-primary" onClick={() => setActive('dashboard')}>← Voltar ao Dashboard</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
