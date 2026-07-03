'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

const MOCK_MEUS_CURSOS = [
  { id: 1, titulo: 'Integração e Onboarding', categoria: 'Onboarding', emoji: '🎯', carga: 4, progresso: 100, status: 'concluido', prazo: null, nota: 9.5, certificado: true },
  { id: 2, titulo: 'LGPD e Proteção de Dados', categoria: 'Compliance', emoji: '⚖️', carga: 8, progresso: 65, status: 'em_andamento', prazo: '10/07/2026', nota: null, certificado: false },
  { id: 3, titulo: 'NR-32 Segurança Hospitalar', categoria: 'Segurança', emoji: '🧤', carga: 16, progresso: 0, status: 'pendente', prazo: '15/07/2026', nota: null, certificado: false },
  { id: 4, titulo: 'Prontuário Eletrônico Soul MV', categoria: 'Técnico', emoji: '💻', carga: 12, progresso: 30, status: 'em_andamento', prazo: '20/07/2026', nota: null, certificado: false },
  { id: 5, titulo: 'Atendimento Humanizado', categoria: 'Assistência', emoji: '❤️', carga: 6, progresso: 100, status: 'concluido', prazo: null, nota: 8.0, certificado: true },
]

const MOCK_TRILHA = [
  { titulo: 'Onboarding Hospitalar', cursos: 4, concluidos: 2, progresso: 50, obrigatoria: true },
  { titulo: 'Técnico de TI Avançado', cursos: 6, concluidos: 1, progresso: 17, obrigatoria: false },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    concluido: { label: '✓ Concluído', cls: 'badge-success' },
    em_andamento: { label: '▶ Em Andamento', cls: 'badge-info' },
    pendente: { label: '○ Pendente', cls: 'badge-warning' },
    reprovado: { label: '✗ Reprovado', cls: 'badge-error' },
  }
  const s = map[status] || { label: status, cls: '' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}

export default function ColaboradorDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pendentes = MOCK_MEUS_CURSOS.filter(c => c.status === 'pendente').length
  const emAndamento = MOCK_MEUS_CURSOS.filter(c => c.status === 'em_andamento').length
  const concluidos = MOCK_MEUS_CURSOS.filter(c => c.status === 'concluido').length
  const certificados = MOCK_MEUS_CURSOS.filter(c => c.certificado).length
  const horasTreinadas = MOCK_MEUS_CURSOS.filter(c => c.status === 'concluido').reduce((a, c) => a + c.carga, 0)

  const pageTitles: Record<string, string> = {
    dashboard: 'Início', cursos: 'Meus Cursos', trilhas: 'Trilhas',
    avaliacoes: 'Avaliações', certificados: 'Certificados',
    biblioteca: 'Biblioteca', notificacoes: 'Notificações',
  }

  return (
    <div className="app-layout">
      <Sidebar perfil="colaborador" userName="Carlos Lima" activeId={active}
        onNavigate={setActive} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopHeader title={pageTitles[active] || active} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-content">

          {active === 'dashboard' && (
            <>
              <h2 className="page-title">Olá, Carlos! 👋</h2>
              <p className="page-subtitle">Continue sua jornada de aprendizagem · Área: Tecnologia da Informação</p>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-warning-light)' }}><span style={{ fontSize: '1.25rem' }}>📋</span></div>
                  <div className="kpi-value" style={{ color: pendentes > 0 ? 'var(--color-warning)' : 'inherit' }}>{pendentes}</div>
                  <div className="kpi-label">Pendentes</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-info-light)' }}><span style={{ fontSize: '1.25rem' }}>▶️</span></div>
                  <div className="kpi-value">{emAndamento}</div>
                  <div className="kpi-label">Em Andamento</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-success-light)' }}><span style={{ fontSize: '1.25rem' }}>✅</span></div>
                  <div className="kpi-value">{concluidos}</div>
                  <div className="kpi-label">Concluídos</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-primary-light)' }}><span style={{ fontSize: '1.25rem' }}>⏱</span></div>
                  <div className="kpi-value">{horasTreinadas}h</div>
                  <div className="kpi-label">Horas Treinadas</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{ background: 'var(--color-admin-light)' }}><span style={{ fontSize: '1.25rem' }}>🏆</span></div>
                  <div className="kpi-value">{certificados}</div>
                  <div className="kpi-label">Certificados</div>
                </div>
              </div>

              {/* Cursos urgentes */}
              {MOCK_MEUS_CURSOS.filter(c => c.prazo && c.status !== 'concluido').length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(to right, var(--color-warning-light), var(--color-surface))' }}>
                  <div className="section-header"><span className="section-title">⏰ Atenção — Prazos se Aproximando</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {MOCK_MEUS_CURSOS.filter(c => c.prazo && c.status !== 'concluido').map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.titulo}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)' }}>Prazo: {c.prazo}</div>
                        </div>
                        <div style={{ width: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                            <span>{c.progresso}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill warning" style={{ width: `${c.progresso}%` }} />
                          </div>
                        </div>
                        <button className="btn btn-sm btn-primary">Continuar</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="section-grid">
                {/* Meus cursos */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Meus Cursos</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setActive('cursos')}>Ver todos</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {MOCK_MEUS_CURSOS.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--color-divider)' }}>
                        <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="truncate" style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{c.titulo}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.carga}h · {c.categoria}</div>
                          {c.status === 'em_andamento' && (
                            <div className="progress-bar" style={{ marginTop: '4px' }}>
                              <div className="progress-fill" style={{ width: `${c.progresso}%` }} />
                            </div>
                          )}
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trilhas */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Minhas Trilhas</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setActive('trilhas')}>Ver todas</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {MOCK_TRILHA.map(t => (
                      <div key={t.titulo} style={{ padding: '16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.titulo}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.concluidos} de {t.cursos} cursos concluídos</div>
                          </div>
                          {t.obrigatoria && <span className="badge badge-error" style={{ fontSize: '10px' }}>Obrigatória</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${t.progresso}%` }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.progresso}%</span>
                        </div>
                        <button className="btn btn-sm btn-primary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>Continuar Trilha →</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificados */}
              {certificados > 0 && (
                <div className="card">
                  <div className="section-header"><span className="section-title">🏆 Meus Certificados</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                    {MOCK_MEUS_CURSOS.filter(c => c.certificado).map(c => (
                      <div key={c.id} style={{ padding: '16px', background: 'linear-gradient(135deg, var(--color-primary-faint), var(--color-primary-light))', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏅</div>
                        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>{c.titulo}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Nota: {c.nota} · {c.carga}h</div>
                        <button className="btn btn-sm btn-primary" style={{ width: '100%', justifyContent: 'center' }}>📥 Baixar</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
