'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

const MOCK_EQUIPE = [
  { nome: 'Carlos Lima', cargo: 'Analista de TI', avatar: 'C', pendentes: 2, em_andamento: 1, concluidos: 5, vencendo: 1 },
  { nome: 'Beatriz Melo', cargo: 'Desenvolvedora', avatar: 'B', pendentes: 0, em_andamento: 3, concluidos: 8, vencendo: 0 },
  { nome: 'Rafael Santos', cargo: 'Suporte TI', avatar: 'R', pendentes: 4, em_andamento: 0, concluidos: 2, vencendo: 3 },
  { nome: 'Juliana Costa', cargo: 'Analista de Sistemas', avatar: 'J', pendentes: 1, em_andamento: 2, concluidos: 7, vencendo: 0 },
  { nome: 'Marcos Pereira', cargo: 'DBA', avatar: 'M', pendentes: 0, em_andamento: 1, concluidos: 11, vencendo: 0 },
  { nome: 'Amanda Silva', cargo: 'UX Designer', avatar: 'A', pendentes: 3, em_andamento: 0, concluidos: 4, vencendo: 2 },
]

export default function GestorDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalPendentes = MOCK_EQUIPE.reduce((a, m) => a + m.pendentes, 0)
  const totalConcluidos = MOCK_EQUIPE.reduce((a, m) => a + m.concluidos, 0)
  const totalMatriculas = MOCK_EQUIPE.reduce((a, m) => a + m.pendentes + m.em_andamento + m.concluidos, 0)
  const taxaConclusao = Math.round((totalConcluidos / totalMatriculas) * 100)
  const vencendo7 = MOCK_EQUIPE.reduce((a, m) => a + m.vencendo, 0)

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard', equipe: 'Minha Equipe',
    treinamentos: 'Treinamentos', pendencias: 'Pendências',
    relatorio: 'Relatório da Equipe', notificacoes: 'Notificações',
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="gestor" userName="Ana Souza" activeId={active}
        onNavigate={setActive} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title={pageTitles[active] || active} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">

          {active === 'dashboard' && (
            <>
              <h2 className="page-title">Olá, Ana! 👋</h2>
              <p className="page-subtitle">Acompanhe o progresso da sua equipe de Tecnologia da Informação</p>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-gestor-light)' }}><span style={{ fontSize: '1.25rem' }}>👥</span></div>
                  <div className="kpi-value">{MOCK_EQUIPE.length}</div>
                  <div className="kpi-label">Membros da Equipe</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-error-light)' }}><span style={{ fontSize: '1.25rem' }}>⚠️</span></div>
                  <div className="kpi-value" style={{ color: totalPendentes > 5 ? 'var(--color-error)' : 'inherit' }}>{totalPendentes}</div>
                  <div className="kpi-label">Pendências Abertas</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-success-light)' }}><span style={{ fontSize: '1.25rem' }}>✅</span></div>
                  <div className="kpi-value">{taxaConclusao}%</div>
                  <div className="kpi-label">Taxa de Conclusão</div>
                  <div className="kpi-trend up">↑ +5% vs mês anterior</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-warning-light)' }}><span style={{ fontSize: '1.25rem' }}>⏰</span></div>
                  <div className="kpi-value" style={{ color: vencendo7 > 0 ? 'var(--color-warning)' : 'inherit' }}>{vencendo7}</div>
                  <div className="kpi-label">Vencendo em 7 dias</div>
                </div>
              </div>

              <div className="section-grid">
                {/* Tabela da equipe */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                  <div className="section-header">
                    <span className="section-title">Situação da Equipe</span>
                    <button className="btn btn-sm btn-primary" onClick={() => setActive('equipe')}>Ver detalhes</button>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Colaborador</th><th>Pendentes</th><th>Em Andamento</th><th>Concluídos</th><th>Progresso</th><th>Alerta</th></tr></thead>
                      <tbody>
                        {MOCK_EQUIPE.map(m => {
                          const total = m.pendentes + m.em_andamento + m.concluidos
                          const pct = Math.round((m.concluidos / total) * 100)
                          return (
                            <tr key={m.nome}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: 'var(--color-gestor)' }}>{m.avatar}</div>
                                  <div>
                                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{m.nome}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{m.cargo}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span style={{ fontWeight: 600, color: m.pendentes > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>{m.pendentes}</span></td>
                              <td><span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{m.em_andamento}</span></td>
                              <td><span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{m.concluidos}</span></td>
                              <td style={{ width: '160px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="progress-bar" style={{ flex: 1 }}>
                                    <div className={`progress-fill ${pct >= 80 ? 'success' : pct >= 40 ? '' : 'warning'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                  <span style={{ fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', minWidth: '32px' }}>{pct}%</span>
                                </div>
                              </td>
                              <td>{m.vencendo > 0 ? <span className="badge badge-error">⚠ {m.vencendo} vencendo</span> : <span className="badge badge-success">OK</span>}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Colaboradores com mais pendências */}
              <div className="card">
                <div className="section-header"><span className="section-title">🚨 Atenção Necessária</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {MOCK_EQUIPE.filter(m => m.pendentes > 1 || m.vencendo > 0).map(m => (
                    <div key={m.nome} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)' }}>
                      <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem', background: 'var(--color-warning)', flexShrink: 0 }}>{m.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {m.pendentes > 0 && `${m.pendentes} cursos pendentes `}
                          {m.vencendo > 0 && `· ${m.vencendo} vencendo em 7 dias`}
                        </div>
                      </div>
                      <button className="btn btn-sm btn-secondary">Cobrar</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {active !== 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🚧</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{pageTitles[active]}</h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '36ch', textAlign: 'center' }}>Esta seção está em desenvolvimento.</p>
              <button className="btn btn-primary" onClick={() => setActive('dashboard')}>← Voltar</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
