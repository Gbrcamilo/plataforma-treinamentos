'use client'
import { useState } from 'react'

type NavItem = { id: string; label: string; icon: string; badge?: number; group?: string }

const ICONS: Record<string, string> = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}

const NAV_ADMIN: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard',     icon: 'dashboard', group: 'Visão Geral' },
  { id: 'usuarios',  label: 'Usuários',       icon: 'users',     group: 'Gestão' },
  { id: 'cursos',    label: 'Cursos',         icon: 'book',      group: 'Gestão' },
  { id: 'trilhas',   label: 'Trilhas',        icon: 'map',       group: 'Gestão' },
  { id: 'avaliacoes',label: 'Avaliações',     icon: 'shield',    group: 'Gestão' },
  { id: 'certificados',label:'Certificados',  icon: 'award',     group: 'Registros' },
  { id: 'relatorios',label: 'Relatórios',     icon: 'chart',     group: 'Registros' },
  { id: 'notificacoes',label:'Notificações',  icon: 'bell',      badge: 4, group: 'Registros' },
  { id: 'configuracoes',label:'Configurações',icon: 'settings',  group: 'Sistema' },
]

const NAV_GESTOR: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard',    icon: 'dashboard', group: 'Visão Geral' },
  { id: 'equipe',    label: 'Minha Equipe', icon: 'users',     group: 'Gestão' },
  { id: 'cursos',    label: 'Catálogo',     icon: 'book',      group: 'Gestão' },
  { id: 'trilhas',   label: 'Trilhas',      icon: 'map',       group: 'Gestão' },
  { id: 'relatorios',label: 'Relatórios',   icon: 'chart',     group: 'Registros' },
  { id: 'notificacoes',label:'Alertas',     icon: 'bell', badge: 2, group: 'Registros' },
]

const NAV_COLAB: NavItem[] = [
  { id: 'dashboard',  label: 'Início',       icon: 'dashboard', group: 'Meu Espaço' },
  { id: 'meusCursos', label: 'Meus Cursos',  icon: 'book',      group: 'Meu Espaço' },
  { id: 'trilhas',    label: 'Trilhas',      icon: 'map',       group: 'Meu Espaço' },
  { id: 'certificados',label:'Certificados', icon: 'award',     group: 'Registros' },
  { id: 'notificacoes',label:'Notificações', icon: 'bell', badge: 1, group: 'Registros' },
]

function IcoSvg({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.dashboard }}
    />
  )
}

const AVATAR_COLORS: Record<string, string> = {
  admin: 'linear-gradient(135deg, #7c4dbe 0%, #c2396b 100%)',
  gestor: 'linear-gradient(135deg, #0e7c7b 0%, #7c4dbe 100%)',
  colaborador: 'linear-gradient(135deg, #c2396b 0%, #0e7c7b 100%)',
}

const PERFIL_LABEL: Record<string, string> = {
  admin: 'Administrador · HDS',
  gestor: 'Gestor de Equipe · HDS',
  colaborador: 'Colaborador · HDS',
}

interface SidebarProps {
  perfil: 'admin' | 'gestor' | 'colaborador'
  userName: string
  activeId: string
  onNavigate: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ perfil, userName, activeId, onNavigate, isOpen, onClose }: SidebarProps) {
  const items = perfil === 'admin' ? NAV_ADMIN : perfil === 'gestor' ? NAV_GESTOR : NAV_COLAB
  const groups = [...new Set(items.map(i => i.group))]

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Navegação principal">

        {/* Logo */}
        <div className="sidebar-header">
          <div className="hds-logo">
            <div className="hds-logo-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <div className="hds-logo-text">
              <div className="hds-logo-name">HDS</div>
              <div className="hds-logo-sub">Sistema de Treinamentos</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {groups.map(group => (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {items.filter(i => i.group === group).map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  aria-current={activeId === item.id ? 'page' : undefined}
                >
                  <IcoSvg name={item.icon} size={18} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar" style={{ background: AVATAR_COLORS[perfil] }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name truncate">{userName}</div>
              <div className="user-role truncate">{PERFIL_LABEL[perfil]}</div>
            </div>
            <button className="btn btn-ghost btn-icon btn-sm" title="Sair" style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <IcoSvg name="logout" size={16} />
            </button>
          </div>
        </div>

      </aside>
    </>
  )
}
