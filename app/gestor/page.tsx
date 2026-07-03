'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Colaborador = {
  nome: string
  cargo: string
  concluidos: number
  emAndamento: number
  pendentes: number
  status: string
}

type Trilha = {
  nome: string
  obrigatorio: boolean
  concluidos: number
  total: number
  prazo: string
}

type Alerta = {
  tipo: string
  msg: string
}

const equipeDemo: Colaborador[] = [
  { nome: 'Ana Paula Souza', cargo: 'Enfermeira', concluidos: 8, emAndamento: 2, pendentes: 1, status: 'em_dia' },
  { nome: 'Carlos Mendes', cargo: 'Técnico de TI', concluidos: 5, emAndamento: 1, pendentes: 3, status: 'atencao' },
  { nome: 'Fernanda Lima', cargo: 'Farmacêutica', concluidos: 10, emAndamento: 0, pendentes: 0, status: 'em_dia' },
  { nome: 'Roberto Costa', cargo: 'Administrativo', concluidos: 3, emAndamento: 3, pendentes: 4, status: 'critico' },
  { nome: 'Juliana Ferreira', cargo: 'Recepcionista', concluidos: 7, emAndamento: 1, pendentes: 1, status: 'em_dia' },
  { nome: 'Marcos Oliveira', cargo: 'Segurança', concluidos: 4, emAndamento: 2, pendentes: 2, status: 'atencao' },
]

const trilhasDemo: Trilha[] = [
  { nome: 'Segurança do Paciente', obrigatorio: true, concluidos: 5, total: 6, prazo: '15/07/2026' },
  { nome: 'Boas Práticas Clínicas', obrigatorio: true, concluidos: 4, total: 6, prazo: '30/07/2026' },
  { nome: 'LGPD na Saúde', obrigatorio: true, concluidos: 6, total: 6, prazo: '10/08/2026' },
  { nome: 'Liderança e Gestão', obrigatorio: false, concluidos: 2, total: 4, prazo: '31/08/2026' },
]

const alertasDemo: Alerta[] = [
  { tipo: 'urgente', msg: 'Roberto Costa: 4 treinamentos obrigatórios vencidos' },
  { tipo: 'atencao', msg: 'Carlos Mendes: prazo se esgota em 3 dias para LGPD' },
  { tipo: 'info', msg: 'Trilha Segurança do Paciente: 83% concluída pela equipe' },
]

const menus = [
  { id: 'Dashboard', icon: '📊' },
  { id: 'Minha Equipe', icon: '👥' },
  { id: 'Trilhas', icon: '🗺️' },
  { id: 'Relatórios', icon: '📋' },
  { id: 'Certificados', icon: '🎓' },
  { id: 'Alertas', icon: '🔔' },
]

export default function GestorPage() {
  const router = useRouter()
  const [aba, setAba] = useState('Dashboard')
  const [busca, setBusca] = useState('')
  const [nomeUsuario, setNomeUsuario] = useState('Gestor')
  const [sidebarAberta, setSidebarAberta] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user?.nome) setNomeUsuario(d.user.nome)
      if (!d.user) router.push('/login')
    }).catch(() => {})
  }, [router])

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }, [router])

  const filtrado = equipeDemo.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    e.cargo.toLowerCase().includes(busca.toLowerCase())
  )

  const statusBadge = (s: string) => {
    if (s === 'em_dia') return <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>Em dia</span>
    if (s === 'atencao') return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>Atenção</span>
    return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>Crítico</span>
  }

  const iniciais = nomeUsuario.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", background: '#f1f5f9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .menu-item:hover { background: rgba(99,102,241,0.15) !important; color: #a5b4fc !important; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .card-hover:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.25s; }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarAberta ? ' open' : ''}`} style={{
        width: 240, background: '#1e293b',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="14" fill="url(#gs)"/>
              <defs><linearGradient id="gs" x1="0" y1="0" x2="80" y2="80"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
              <path d="M24 30h32M24 40h24M24 50h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em' }}>HDS</div>
              <div style={{ color: '#64748b', fontSize: 10, fontWeight: 500 }}>Portal do Gestor</div>
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
                background: aba === m.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: aba === m.id ? '#a5b4fc' : '#94a3b8',
                fontWeight: aba === m.id ? 700 : 400, fontSize: 13,
                borderLeft: aba === m.id ? '3px solid #6366f1' : '3px solid transparent',
                display: 'flex', alignItems: 'center', gap: 9,
                transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>{m.id}
              {m.id === 'Alertas' && <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: 99, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{alertasDemo.filter(a => a.tipo === 'urgente').length}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{iniciais}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nomeUsuario}</div>
              <div style={{ color: '#475569', fontSize: 10 }}>Gestor</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '7px', borderRadius: 7, border: '1px solid #334155', background: 'transparent', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sair
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarAberta && <div onClick={() => setSidebarAberta(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}

      {/* MAIN */}
      <main className="main-content" style={{ marginLeft: 240, flex: 1, minHeight: '100vh', overflowX: 'hidden' }}>
        {/* TOPBAR */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarAberta(true)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} className="mobile-menu-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: 0 }}>{aba}</h1>
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>Portal do Gestor · HDS Treinamentos</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {alertasDemo.filter(a => a.tipo === 'urgente').length > 0 && (
              <button onClick={() => setAba('Alertas')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#64748b' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '28px' }}>

          {/* ═══════════════ DASHBOARD ═══════════════ */}
          {aba === 'Dashboard' && (
            <>
              {/* KPIs */}
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Colaboradores', val: equipeDemo.length, sub: 'na equipe', cor: '#6366f1', icon: '👥' },
                  { label: 'Conformidade', val: '72%', sub: 'média geral', cor: '#10b981', icon: '✅' },
                  { label: 'Vencidos', val: alertasDemo.filter(a => a.tipo === 'urgente').length, sub: 'pendências críticas', cor: '#ef4444', icon: '⚠️' },
                  { label: 'Certificados', val: 24, sub: 'emitidos este ano', cor: '#f59e0b', icon: '🎓' },
                ].map(k => (
                  <div key={k.label} className="card-hover" style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: k.cor, fontVariantNumeric: 'tabular-nums' }}>{k.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{k.label}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{k.sub}</div>
                      </div>
                      <span style={{ fontSize: 22 }}>{k.icon}</span>
                    </div>
                    <div style={{ marginTop: 12, height: 3, borderRadius: 99, background: '#f1f5f9' }}>
                      <div style={{ width: '100%', height: 3, borderRadius: 99, background: k.cor, opacity: 0.4 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }}>
                {/* Trilhas */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>Progresso das Trilhas</h2>
                  {trilhasDemo.map(t => {
                    const pct = Math.round((t.concluidos / t.total) * 100)
                    return (
                      <div key={t.nome} style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.nome}</span>
                            {t.obrigatorio && <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>Obrigatório</span>}
                          </div>
                          <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8 }}>Prazo: {t.prazo}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : pct >= 60 ? '#6366f1' : '#ef4444', borderRadius: 99, height: 8, transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.concluidos}/{t.total}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Alertas */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alertas da Equipe</h2>
                  {alertasDemo.map((a, i) => (
                    <div key={i} style={{
                      padding: '12px 14px', borderRadius: 10, marginBottom: 10,
                      background: a.tipo === 'urgente' ? '#fef2f2' : a.tipo === 'atencao' ? '#fffbeb' : '#eff6ff',
                      borderLeft: `4px solid ${a.tipo === 'urgente' ? '#ef4444' : a.tipo === 'atencao' ? '#f59e0b' : '#3b82f6'}`,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: a.tipo === 'urgente' ? '#991b1b' : a.tipo === 'atencao' ? '#92400e' : '#1e40af', lineHeight: 1.4 }}>{a.msg}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipe resumo */}
              <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resumo da Equipe</h2>
                  <button onClick={() => setAba('Minha Equipe')} className="btn-primary" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}>Ver todos</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                    <thead>
                      <tr>
                        {['Colaborador', 'Cargo', 'Concluídos', 'Andamento', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {equipeDemo.slice(0, 5).map(e => (
                        <tr key={e.nome} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{e.nome}</td>
                          <td style={{ padding: '12px 12px', fontSize: 12, color: '#64748b' }}>{e.cargo}</td>
                          <td style={{ padding: '12px 12px', fontSize: 14, fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>{e.concluidos}</td>
                          <td style={{ padding: '12px 12px', fontSize: 14, fontWeight: 700, color: '#6366f1', fontVariantNumeric: 'tabular-nums' }}>{e.emAndamento}</td>
                          <td style={{ padding: '12px 12px' }}>{statusBadge(e.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ MINHA EQUIPE ═══════════════ */}
          {aba === 'Minha Equipe' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{equipeDemo.length} colaboradores encontrados</p>
                <input value={busca} onChange={e => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou cargo..."
                  style={{ padding: '9px 14px', borderRadius: 9, border: '1px solid #e2e8f0', fontSize: 13, width: 260, outline: 'none', background: 'white' }} />
              </div>
              <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                {filtrado.map(e => {
                  const total = e.concluidos + e.emAndamento + e.pendentes
                  const pct = total > 0 ? Math.round((e.concluidos / total) * 100) : 0
                  return (
                    <div key={e.nome} className="card-hover" style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                            {e.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{e.nome}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{e.cargo}</div>
                          </div>
                        </div>
                        {statusBadge(e.status)}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                        {[{ l: 'Concluídos', v: e.concluidos, c: '#10b981' }, { l: 'Andamento', v: e.emAndamento, c: '#6366f1' }, { l: 'Pendentes', v: e.pendentes, c: '#ef4444' }].map(x => (
                          <div key={x.l} style={{ flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 8, padding: '8px 4px' }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: x.c, fontVariantNumeric: 'tabular-nums' }}>{x.v}</div>
                            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>Progresso geral</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#1e293b' }}>{pct}%</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, background: pct >= 70 ? '#10b981' : pct >= 40 ? '#6366f1' : '#ef4444', borderRadius: 99, height: 6 }} />
                        </div>
                      </div>
                      <button style={{ width: '100%', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px', fontSize: 12, color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}>Ver detalhes</button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ═══════════════ RELATÓRIOS ═══════════════ */}
          {aba === 'Relatórios' && (
            <>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Exporte dados da sua equipe em PDF ou CSV.</p>
              <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  { titulo: 'Conformidade Geral', desc: '% de conclusão por colaborador e trilha', cor: '#6366f1' },
                  { titulo: 'Treinamentos Vencidos', desc: 'Lista de pendências e prazos expirados', cor: '#ef4444' },
                  { titulo: 'Certificados Emitidos', desc: 'Todos os certificados da equipe', cor: '#10b981' },
                  { titulo: 'Progresso por Trilha', desc: 'Status de cada trilha na equipe', cor: '#f59e0b' },
                  { titulo: 'Histórico de Acesso', desc: 'Logs de acesso e atividade', cor: '#8b5cf6' },
                  { titulo: 'Desempenho em Avaliações', desc: 'Notas e tentativas por colaborador', cor: '#0ea5e9' },
                ].map(r => (
                  <div key={r.titulo} className="card-hover" style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${r.cor}` }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>{r.titulo}</h3>
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>{r.desc}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ flex: 1, background: r.cor, color: 'white', border: 'none', borderRadius: 7, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>PDF</button>
                      <button style={{ flex: 1, background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: 7, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>CSV</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════ ALERTAS ═══════════════ */}
          {aba === 'Alertas' && (
            <>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>{alertasDemo.length} alertas ativos</p>
              <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alertasDemo.map((a, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: 12, padding: '16px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    borderLeft: `5px solid ${a.tipo === 'urgente' ? '#ef4444' : a.tipo === 'atencao' ? '#f59e0b' : '#3b82f6'}`,
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <span style={{ fontSize: 20 }}>{a.tipo === 'urgente' ? '🚨' : a.tipo === 'atencao' ? '⏰' : 'ℹ️'}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{a.msg}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{a.tipo === 'urgente' ? 'Urgente' : a.tipo === 'atencao' ? 'Atenção' : 'Informação'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PLACEHOLDER */}
          {!['Dashboard', 'Minha Equipe', 'Relatórios', 'Alertas'].includes(aba) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>🔧</div>
              <h2 style={{ color: '#1e293b', fontWeight: 800, marginBottom: 8, fontSize: 18 }}>{aba}</h2>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Esta seção está sendo implementada.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
