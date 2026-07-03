'use client'
import { useEffect, useState } from 'react'

type Props = {
  title: string
  onMenuToggle: () => void
}

export default function TopHeader({ title, onMenuToggle }: Props) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const d = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(d)
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light')
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-ghost menu-toggle" onClick={onMenuToggle} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="btn btn-ghost" style={{ position: 'relative' }} aria-label="Notificações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--color-error)', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />
        </button>
        <button className="btn btn-ghost" onClick={toggleTheme} aria-label="Alternar tema">
          {dark
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
      </div>
    </header>
  )
}
