'use client'
import { useEffect, useState } from 'react'

const SUN = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
const MOON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
const BELL = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'
const MENU = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'

function Ico({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  )
}

interface TopHeaderProps {
  title: string
  onMenuToggle: () => void
  breadcrumb?: string[]
}

export default function TopHeader({ title, onMenuToggle, breadcrumb }: TopHeaderProps) {
  const [dark, setDark] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const pref = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(pref)
    document.documentElement.setAttribute('data-theme', pref ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <header className="top-header" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <button className="btn btn-ghost btn-icon menu-toggle" onClick={onMenuToggle} aria-label="Abrir menu">
          <Ico d={MENU} />
        </button>
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <span>HDS</span>
              {breadcrumb.map((b, i) => (
                <><span key={`sep-${i}`}>›</span><span key={b} style={{ color: 'var(--text-muted)' }}>{b}</span></>
              ))}
            </nav>
          )}
          <h1 className="header-title">{title}</h1>
        </div>
      </div>

      <div className="header-actions">
        {/* Notificações */}
        <div style={{ position: 'relative' }}>
          <button
            className="theme-toggle"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notificações"
            style={{ position: 'relative' }}
          >
            <Ico d={BELL} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--pink)',
              border: '2px solid var(--surface)'
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 320, background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-2xl)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-display)' }}>Notificações</span>
                <span className="badge badge-pink">4 novas</span>
              </div>
              {[
                { texto: 'NR-32 vence em 12 dias para 23 colaboradores', urgente: true, tempo: '2min' },
                { texto: 'Ana Souza concluiu LGPD e Proteção de Dados', urgente: false, tempo: '18min' },
                { texto: '5 certificados aguardando emissão', urgente: false, tempo: '1h' },
                { texto: 'Nova solicitação de curso: Biossegurança', urgente: false, tempo: '2h' },
              ].map((n, i) => (
                <div key={i} className="notif-item" style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  <div className={`notif-dot ${n.urgente ? 'unread' : 'read'}`} style={{ marginTop: 5 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>{n.texto}</p>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{n.tempo} atrás</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: 'var(--sp-3) var(--sp-5)', borderTop: '1px solid var(--divider)' }}>
                <button style={{ width: '100%', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--pink)', fontWeight: 600 }}
                  onClick={() => setNotifOpen(false)}>Ver todas as notificações</button>
              </div>
            </div>
          )}
        </div>

        {/* Toggle tema */}
        <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}>
          <Ico d={dark ? SUN : MOON} />
        </button>
      </div>
    </header>
  )
}
