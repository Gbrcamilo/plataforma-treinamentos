'use client'
import { useState } from 'react'

type NavItem = { label: string; icon: string; id: string; badge?: number }

const navAdmin: NavItem[] = [
  { label: 'Dashboard', icon: '⊞', id: 'dashboard' },
  { label: 'Usuários', icon: '👥', id: 'usuarios' },
  { label: 'Cursos', icon: '📚', id: 'cursos' },
  { label: 'Trilhas', icon: '🗺', id: 'trilhas' },
  { label: 'Avaliações', icon: '📝', id: 'avaliacoes' },
  { label: 'Certificados', icon: '🏆', id: 'certificados' },
  { label: 'Relatórios', icon: '📊', id: 'relatorios' },
  { label: 'Notificações', icon: '🔔', id: 'notificacoes', badge: 3 },
  { label: 'Configurações', icon: '⚙', id: 'configuracoes' },
]

const navGestor: NavItem[] = [
  { label: 'Dashboard', icon: '⊞', id: 'dashboard' },
  { label: 'Minha Equipe', icon: '👥', id: 'equipe' },
  { label: 'Treinamentos', icon: '📚', id: 'treinamentos' },
  { label: 'Pendências', icon: '⚠', id: 'pendencias', badge: 5 },
  { label: 'Relatório da Equipe', icon: '📊', id: 'relatorio' },
  { label: 'Notificações', icon: '🔔', id: 'notificacoes', badge: 2 },
]

const navColaborador: NavItem[] = [
  { label: 'Início', icon: '⊞', id: 'dashboard' },
  { label: 'Meus Cursos', icon: '📚', id: 'cursos' },
  { label: 'Trilhas', icon: '🗺', id: 'trilhas' },
  { label: 'Minhas Avaliações', icon: '📝', id: 'avaliacoes' },
  { label: 'Certificados', icon: '🏆', id: 'certificados' },
  { label: 'Biblioteca', icon: '📖', id: 'biblioteca' },
  { label: 'Notificações', icon: '🔔', id: 'notificacoes', badge: 1 },
]

type Props = {
  perfil: 'admin' | 'gestor' | 'colaborador'
  userName: string
  activeId: string
  onNavigate: (id: string) => void
  isOpen?: boolean
  onClose?: () => void
}

const perfilColors: Record<string, string> = {
  admin: 'var(--color-admin)', gestor: 'var(--color-gestor)', colaborador: 'var(--color-colaborador)'
}
const perfilLabels: Record<string, string> = {
  admin: 'Administrador', gestor: 'Gestor', colaborador: 'Colaborador'
}

export default function Sidebar({ perfil, userName, activeId, onNavigate, isOpen, onClose }: Props) {
  const nav = perfil === 'admin' ? navAdmin : perfil === 'gestor' ? navGestor : navColaborador

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 7h6v1.5H4zM4 10h6v1.5H4zM4 13h4v1.5H4zM12 5l6 5-6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="sidebar-logo-text">
            Treinamentos<span>Plataforma Corporativa</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>
          {nav.map(item => (
            <button key={item.id} className={`nav-item ${activeId === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose?.() }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar" style={{ background: perfilColors[perfil] }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name truncate">{userName}</div>
              <div className="user-role">
                <span className={`badge badge-${perfil === 'admin' ? 'admin' : perfil === 'gestor' ? 'gestor' : 'primary'}`}
                  style={{ padding: '1px 6px', fontSize: '10px' }}>
                  {perfilLabels[perfil]}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-ghost" style={{ marginLeft: 'auto', padding: '6px' }} title="Sair">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
