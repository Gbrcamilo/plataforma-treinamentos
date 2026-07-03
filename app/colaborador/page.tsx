'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Curso = {
  nome: string
  categoria: string
  progresso: number
  concluido: boolean
  nota: number | null
  prazo: string
  cor: string
}

type Certificado = {
  nome: string
  data: string
  validade: string
  id: string
}

type Notificacao = {
  tipo: string
  msg: string
  hora: string
}

const cursosDemo: Curso[] = [
  { nome: 'Segurança do Paciente', categoria: 'Obrigatório', progresso: 100, concluido: true, nota: 9.2, prazo: 'Concluído', cor: '#10b981' },
  { nome: 'LGPD na Saúde', categoria: 'Obrigatório', progresso: 68, concluido: false, nota: null, prazo: '10/07/2026', cor: '#6366f1' },
  { nome: 'Prevenção de Infecções', categoria: 'Obrigatório', progresso: 0, concluido: false, nota: null, prazo: '20/07/2026', cor: '#ef4444' },
  { nome: 'Comunicação Não Violenta', categoria: 'Complementar', progresso: 45, concluido: false, nota: null, prazo: '31/08/2026', cor: '#f59e0b' },
  { nome: 'Excel para Saúde', categoria: 'Complementar', progresso: 100, concluido: true, nota: 8.5, prazo: 'Concluído', cor: '#10b981' },
]

const certificadosDemo: Certificado[] = [
  { nome: 'Segurança do Paciente', data: '12/06/2026', validade: '12/06/2027', id: 'CERT-2026-001' },
  { nome: 'Excel para Saúde', data: '05/05/2026', validade: '05/05/2027', id: 'CERT-2026-002' },
]

const notificacoesDemo: Notificacao[] = [
  { tipo: 'urgente', msg: 'LGPD na Saúde vence em 7 dias — complete agora!', hora: 'Hoje' },
  { tipo: 'info', msg: 'Novo curso disponível: Gestão de Resíduos Hospitalares', hora: 'Ontem' },
  { tipo: 'sucesso', msg: 'Certificado de Segurança do Paciente emitido com sucesso', hora: '12/06' },
]

const menus = [
  { id: 'Início', icon: '🏠' },
  { id: 'Meus Cursos', icon: '📚' },
  { id: 'Trilhas', icon: '🗺️' },
  { id: 'Certificados', icon: '🎓' },
  { id: 'Avaliações', icon: '📝' },
  { id: 'Notificações', icon: '🔔' },
]

export default function ColaboradorPage() {
  const router = useRouter()
  const [aba, setAba] = useState('Início')
  const [nomeUsuario, setNomeUsuario] = useState('Colaborador')
  const [cargoUsuario, setCargoUsuario] = useState('Equipe de Saúde')
  const [sidebarAberta, setSidebarAberta] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user?.nome) setNomeUsuario(d.user.nome)
      if (d.user?.cargo) setCargoUsuario(d.user.cargo)
      if (!d.user) router.push('/login')
    }).catch(() => {})
  }, [router])

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }, [router])

  const concluidos = cursosDemo.filter(c => c.concluido).length
  const progMedio = Math.round(cursosDemo.reduce((acc, c) => acc + c.progresso, 0) / cursosDemo.length)
  const iniciais = nomeUsuario.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
  const urgentes = notificacoesDemo.filter(n => n.tipo === 'urgente')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", background: '#f0fdf4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .menu-item:hover { background: rgba(16,185,129,0.15) !important; color: #6ee7b7 !important; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .card-hover:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.25s; }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .curso-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarAberta ? ' open' : ''}`} style={{
        width: 240, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="14" fill="url(#cs)"/>
              <defs><linearGradient id="cs" x1="0" y1="0" x2="80" y2="80"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#059669"/></linearGradient></defs>
              <path d="M20 40l12 12 28-28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 13 }}>HDS</div>
              <div style={{ color: '#475569', fontSize: 10, fontWeight: 500 }}>Meu Portal</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
          {menus.map(m => (
            <button key={m.id} onClick={() => { setAba(m.id); setSidebarAberta(false) }}
              className="menu-item"
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                background: aba === m.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: aba === m.id ? '#6ee7b7' : '#94a3b8',
                fontWeight: aba === m.id ? 700 : 400, fontSize: 13,
                borderLeft: aba === m.id ? '3px solid #10b981' : '3px solid transparent',
                display: 'flex', alignItems: 'center', gap: 9,
                transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>{m.id}
              {m.id === 'Notificações' && urgentes.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: 99, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{urgentes.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{iniciais}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nomeUsuario}</div>
              <div style={{ color: '#475569', fontSize: 10 }}>{cargoUsuario}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '7px', borderRadius: 7, border: '1px solid #1e293b', background: 'transparent', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sair
          </button>
        </div>
      </aside>

      {sidebarAberta && <div onClick={() => setSidebarAberta(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}

      {/* MAIN */}
      <main className="main-content" style={{ marginLeft: 240, flex: 1, minHeight: '100vh', overflowX: 'hidden' }}>
        {/* TOPBAR */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: 0 }}>{aba}</h1>
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>HDS Treinamentos · Olá, {nomeUsuario.split(' ')[0]}!</p>
          </div>
          {urgentes.length > 0 && (
            <button onClick={() => setAba('Notificações')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              <span>🔔</span> {urgentes[0].msg.slice(0, 40)}...
            </button>
          )}
        </div>

        <div style={{ padding: '28px' }}>

          {/* ═══════════════ INÍCIO ═══════════════ */}
          {aba === 'Início' && (
            <>
              {/* KPIs */}
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Concluídos', val: `${concluidos}/${cursosDemo.length}`, sub: 'cursos', cor: '#10b981', icon: '✅' },
                  { label: 'Progresso Médio', val: `${progMedio}%`, sub: 'nos ativos', cor: '#6366f1', icon: '📈' },
                  { label: 'Certificados', val: certificadosDemo.length, sub: 'emitidos', cor: '#f59e0b', icon: '🎓' },
                  { label: 'Prazo Próximo', val: '7 dias', sub: 'LGPD na Saúde', cor: '#ef4444', icon: '⏰' },
                ].map(k => (
                  <div key={k.label} className="card-hover" style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: k.cor, fontVariantNumeric: 'tabular-nums' }}>{k.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{k.label}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{k.sub}</div>
                      </div>
                      <span style={{ fontSize: 20 }}>{k.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Continuar aprendendo */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Continuar aprendendo</h2>
                    <button onClick={() => setAba('Meus Cursos')} style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver todos →</button>
                  </div>
                  {cursosDemo.filter(c => !c.concluido).slice(0, 3).map((c, i) => (
                    <div key={i} style={{ padding: '14px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{c.nome}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Prazo: {c.prazo} · <span style={{ background: c.categoria === 'Obrigatório' ? '#fee2e2' : '#f0f9ff', color: c.categoria === 'Obrigatório' ? '#991b1b' : '#0c4a6e', padding: '1px 5px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{c.categoria}</span></div>
                        </div>
                        <button className="btn-primary" style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.2s, transform 0.2s' }}>Continuar</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${c.progresso}%`, background: c.cor, borderRadius: 99, height: 6 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#1e293b', minWidth: 30 }}>{c.progresso}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certificados */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Meus Certificados</h2>
                  {certificadosDemo.map((cert, i) => (
                    <div key={i} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px', marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#065f46', marginBottom: 4 }}>{cert.nome}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Emitido: {cert.data}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>Válido até: {cert.validade}</div>
                      <button style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>⬇ Baixar</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ MEUS CURSOS ═══════════════ */}
          {aba === 'Meus Cursos' && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {['Todos', 'Obrigatórios', 'Complementares', 'Concluídos'].map(f => (
                  <button key={f} style={{ padding: '6px 16px', borderRadius: 99, border: '1px solid #e2e8f0', background: f === 'Todos' ? '#10b981' : 'white', color: f === 'Todos' ? 'white' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{f}</button>
                ))}
              </div>
              <div className="curso-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
                {cursosDemo.map((c, i) => (
                  <div key={i} className="card-hover" style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: 5, background: c.cor }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: 0, flex: 1, lineHeight: 1.3 }}>{c.nome}</h3>
                        <span style={{ marginLeft: 10, background: c.categoria === 'Obrigatório' ? '#fee2e2' : '#f0f9ff', color: c.categoria === 'Obrigatório' ? '#991b1b' : '#0c4a6e', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{c.categoria}</span>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>Progresso</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: c.cor }}>{c.progresso}%</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${c.progresso}%`, background: c.cor, borderRadius: 99, height: 8 }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.prazo !== 'Concluído' ? `Prazo: ${c.prazo}` : '✓ Concluído'}</span>
                        {c.concluido
                          ? <button style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #bbf7d0', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver certificado</button>
                          : <button className="btn-primary" style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}>Continuar</button>
                        }
                      </div>
                      {c.nota !== null && (
                        <div style={{ marginTop: 10, padding: '6px 10px', background: '#fef9c3', borderRadius: 6 }}>
                          <span style={{ fontSize: 12, color: '#92400e', fontWeight: 700 }}>Nota final: {c.nota}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════ CERTIFICADOS ═══════════════ */}
          {aba === 'Certificados' && (
            <>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>{certificadosDemo.length} certificados emitidos</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
                {certificadosDemo.map((c, i) => (
                  <div key={i} className="card-hover" style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '2px solid #d1fae5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{c.nome}</div>
                        <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>Certificado válido</div>
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px', marginBottom: 18 }}>
                      {[['ID', c.id], ['Emitido em', c.data], ['Válido até', c.validade]].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{k}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: k === 'Válido até' ? '#10b981' : '#1e293b' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}>⬇ Download PDF</button>
                      <button style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Compartilhar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════ NOTIFICAÇÕES ═══════════════ */}
          {aba === 'Notificações' && (
            <>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>{notificacoesDemo.length} notificações</p>
              <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notificacoesDemo.map((n, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: 12, padding: '16px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    borderLeft: `5px solid ${n.tipo === 'urgente' ? '#ef4444' : n.tipo === 'sucesso' ? '#10b981' : '#6366f1'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{n.tipo === 'urgente' ? '🔔' : n.tipo === 'sucesso' ? '✅' : 'ℹ️'}</span>
                      <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>{n.msg}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.hora}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PLACEHOLDER */}
          {!['Início', 'Meus Cursos', 'Certificados', 'Notificações'].includes(aba) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>🚀</div>
              <h2 style={{ color: '#1e293b', fontWeight: 800, marginBottom: 8, fontSize: 18 }}>{aba}</h2>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Esta seção será implementada em breve.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
