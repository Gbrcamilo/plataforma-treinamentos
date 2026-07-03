'use client'
import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CURSOS = [
  { id: 1, titulo: 'Integração e Onboarding', categoria: 'Onboarding', carga: 4, obrigatorio: true, status: 'publicado', matriculas: 142, conclusao: 88 },
  { id: 2, titulo: 'LGPD e Proteção de Dados', categoria: 'Compliance', carga: 8, obrigatorio: true, status: 'publicado', matriculas: 98, conclusao: 72 },
  { id: 3, titulo: 'NR-32 Segurança Hospitalar', categoria: 'Segurança', carga: 16, obrigatorio: true, status: 'publicado', matriculas: 67, conclusao: 61 },
  { id: 4, titulo: 'Prontuário Eletrônico Soul MV', categoria: 'Técnico', carga: 12, obrigatorio: false, status: 'publicado', matriculas: 45, conclusao: 54 },
  { id: 5, titulo: 'Liderança e Gestão de Equipes', categoria: 'Gestão', carga: 20, obrigatorio: false, status: 'rascunho', matriculas: 0, conclusao: 0 },
  { id: 6, titulo: 'Atendimento ao Paciente', categoria: 'Assistência', carga: 6, obrigatorio: true, status: 'publicado', matriculas: 115, conclusao: 79 },
]

const MOCK_USERS = [
  { id: 1, nome: 'Ana Souza', email: 'ana@hospital.com', perfil: 'gestor', area: 'Tecnologia', status: 'ativo', ultimo_acesso: '03/07/2026', cursos_concluidos: 8 },
  { id: 2, nome: 'Carlos Lima', email: 'carlos@hospital.com', perfil: 'colaborador', area: 'Assistência', status: 'ativo', ultimo_acesso: '02/07/2026', cursos_concluidos: 5 },
  { id: 3, nome: 'Beatriz Melo', email: 'beatriz@hospital.com', perfil: 'colaborador', area: 'RH', status: 'ativo', ultimo_acesso: '01/07/2026', cursos_concluidos: 7 },
  { id: 4, nome: 'Diego Faria', email: 'diego@hospital.com', perfil: 'gestor', area: 'Administrativo', status: 'ativo', ultimo_acesso: '03/07/2026', cursos_concluidos: 11 },
  { id: 5, nome: 'Fernanda Reis', email: 'fernanda@hospital.com', perfil: 'colaborador', area: 'Segurança', status: 'inativo', ultimo_acesso: '15/06/2026', cursos_concluidos: 3 },
  { id: 6, nome: 'Ricardo Neves', email: 'ricardo@hospital.com', perfil: 'colaborador', area: 'Tecnologia', status: 'ativo', ultimo_acesso: '03/07/2026', cursos_concluidos: 9 },
]

const MOCK_TRILHAS = [
  { id: 1, titulo: 'Onboarding Completo', cursos: 4, usuarios: 58, progresso: 72, status: 'ativo' },
  { id: 2, titulo: 'Compliance & Segurança', cursos: 3, usuarios: 89, progresso: 65, status: 'ativo' },
  { id: 3, titulo: 'Liderança Hospitalar', cursos: 5, usuarios: 24, progresso: 40, status: 'ativo' },
  { id: 4, titulo: 'Técnico Soul MV', cursos: 2, usuarios: 37, progresso: 55, status: 'rascunho' },
]

const MOCK_ALERTAS = [
  { tipo: 'vencimento', texto: 'NR-32 vence em 12 dias para 23 colaboradores', urgente: true },
  { tipo: 'inativo', texto: '14 usuários sem acesso há mais de 30 dias', urgente: false },
  { tipo: 'pendente', texto: '5 certificados aguardando emissão manual', urgente: false },
  { tipo: 'novo', texto: 'Solicitação de novo curso: Biossegurança Avançada', urgente: false },
]

const MOCK_ATIVIDADES = [
  { usuario: 'Ana Souza', acao: 'Concluiu', curso: 'LGPD e Proteção de Dados', tempo: '2 min atrás', avatar: 'A' },
  { usuario: 'Carlos Lima', acao: 'Iniciou', curso: 'NR-32 Segurança Hospitalar', tempo: '18 min atrás', avatar: 'C' },
  { usuario: 'Beatriz Melo', acao: 'Obteve certificado', curso: 'Integração e Onboarding', tempo: '45 min atrás', avatar: 'B' },
  { usuario: 'Ricardo Neves', acao: 'Concluiu', curso: 'Atendimento ao Paciente', tempo: '1h atrás', avatar: 'R' },
  { usuario: 'Diego Faria', acao: 'Criou trilha', curso: 'Liderança Hospitalar', tempo: '2h atrás', avatar: 'D' },
]

// ─── Ícones SVG ──────────────────────────────────────────────────────────────
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
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
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

// ─── Chart de barras inline ───────────────────────────────────────────────────
const BarMiniChart = ({ data, color = 'var(--color-primary)' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px' }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: color, borderRadius: '3px 3px 0 0',
          height: `${(v / max) * 100}%`, opacity: i === data.length - 1 ? 1 : 0.35,
          transition: 'height 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
      ))}
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ value, label, icon, color, trend, trendLabel, sparkline }: {
  value: string | number; label: string; icon: string;
  color: string; trend?: 'up' | 'down' | 'neutral'; trendLabel?: string;
  sparkline?: number[];
}) => (
  <div className="kpi-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
      <div className="kpi-icon" style={{ background: color + '18', color }}>
        <Icon name={icon} size={20} />
      </div>
      {sparkline && <BarMiniChart data={sparkline} color={color} />}
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

// ─── Progress Row ─────────────────────────────────────────────────────────────
const ProgressRow = ({ label, value, total, color = 'var(--color-primary)' }: {
  label: string; value: number; total: number; color?: string
}) => {
  const pct = Math.round((value / total) * 100)
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{label}</span>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Modal de novo usuário ─────────────────────────────────────────────────────
const ModalNovoUsuario = ({ onClose }: { onClose: () => void }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={onClose}>
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Novo Usuário</h3>
        <button className="btn btn-ghost" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Nome completo</label>
          <input className="form-input" placeholder="Ex: João Silva" />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" placeholder="joao@hospital.com" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Perfil</label>
            <select className="form-input">
              <option>Colaborador</option>
              <option>Gestor</option>
              <option>Administrador</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Área</label>
            <select className="form-input">
              <option>Tecnologia</option>
              <option>Assistência</option>
              <option>RH</option>
              <option>Segurança</option>
              <option>Administrativo</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex: 1 }}>Criar Usuário</button>
        </div>
      </div>
    </div>
  </div>
)

// ─── Modal de novo curso ───────────────────────────────────────────────────────
const ModalNovoCurso = ({ onClose }: { onClose: () => void }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={onClose}>
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Novo Curso</h3>
        <button className="btn btn-ghost" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label">Título do curso</label>
          <input className="form-input" placeholder="Ex: Biossegurança Avançada" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select className="form-input">
              <option>Compliance</option>
              <option>Segurança</option>
              <option>Técnico</option>
              <option>Gestão</option>
              <option>Onboarding</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Carga horária</label>
            <input className="form-input" type="number" placeholder="Ex: 8" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Obrigatório?</label>
            <select className="form-input"><option>Sim</option><option>Não</option></select>
          </div>
          <div className="form-group">
            <label className="form-label">Status inicial</label>
            <select className="form-input"><option>Rascunho</option><option>Publicado</option></select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex: 1 }}>Criar Curso</button>
        </div>
      </div>
    </div>
  </div>
)

// ─── Página principal ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [modalUsuario, setModalUsuario] = useState(false)
  const [modalCurso, setModalCurso] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const kpis = {
    total_cursos: 18,
    total_usuarios: 234,
    taxa_conclusao: 76,
    treinamentos_vencendo: 12,
    matriculas_em_andamento: 89,
    matriculas_concluidas: 312
  }

  const usuariosFiltrados = MOCK_USERS.filter(u =>
    (filterStatus === 'todos' || u.status === filterStatus) &&
    (u.nome.toLowerCase().includes(search.toLowerCase()) || u.area.toLowerCase().includes(search.toLowerCase()))
  )

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    usuarios: 'Gestão de Usuários',
    cursos: 'Catálogo de Cursos',
    trilhas: 'Trilhas de Aprendizagem',
    avaliacoes: 'Avaliações',
    certificados: 'Certificados',
    relatorios: 'Relatórios',
    notificacoes: 'Notificações',
    configuracoes: 'Configurações',
  }

  return (
    <div className="app-layout">
      {modalUsuario && <ModalNovoUsuario onClose={() => setModalUsuario(false)} />}
      {modalCurso && <ModalNovoCurso onClose={() => setModalCurso(false)} />}

      <Sidebar perfil="admin" userName="Administrador" activeId={active}
        onNavigate={(id) => { setActive(id); setSidebarOpen(false) }}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <TopHeader
          title={pageTitles[active] || active}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />

        <main className="page-content">

          {/* ═══════════ DASHBOARD ═══════════ */}
          {active === 'dashboard' && (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Visão Geral da Plataforma</h2>
                  <p className="page-subtitle" style={{ marginBottom: 0, textTransform: 'capitalize' }}>{today}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" onClick={() => setActive('relatorios')}>
                    <Icon name="download" /> Exportar
                  </button>
                  <button className="btn btn-primary" onClick={() => setModalCurso(true)}>
                    <Icon name="plus" /> Novo Curso
                  </button>
                </div>
              </div>

              {/* Alertas */}
              {MOCK_ALERTAS.filter(a => a.urgente).map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-warning-light)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', color: 'var(--color-warning)' }}>
                  <Icon name="alert" size={16} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{a.texto}</span>
                  <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-warning)' }} onClick={() => {}}><Icon name="x" size={14} /></button>
                </div>
              ))}

              {/* KPIs */}
              <div className="kpi-grid">
                <KpiCard value={kpis.total_cursos} label="Cursos Ativos" icon="book"
                  color="var(--color-primary)" trend="up" trendLabel="+3 este mês"
                  sparkline={[8, 10, 11, 13, 14, 15, 18]} />
                <KpiCard value={kpis.total_usuarios} label="Usuários Ativos" icon="users"
                  color="var(--color-info)" trend="up" trendLabel="+18 este mês"
                  sparkline={[180, 195, 205, 210, 218, 226, 234]} />
                <KpiCard value={`${kpis.taxa_conclusao}%`} label="Taxa de Conclusão" icon="chart"
                  color="var(--color-success)" trend="up" trendLabel="+4% vs mês anterior"
                  sparkline={[60, 65, 68, 70, 72, 74, 76]} />
                <KpiCard value={kpis.treinamentos_vencendo} label="Vencem em 30 dias" icon="clock"
                  color="var(--color-warning)" trend="down" trendLabel="Atenção necessária"
                  sparkline={[5, 7, 8, 9, 11, 12, 12]} />
                <KpiCard value={kpis.matriculas_em_andamento} label="Em Andamento" icon="play"
                  color="var(--color-gestor)" trend="neutral" trendLabel="Estável"
                  sparkline={[80, 85, 90, 88, 91, 87, 89]} />
                <KpiCard value={kpis.matriculas_concluidas} label="Matrículas Concluídas" icon="award"
                  color="var(--color-admin)" trend="up" trendLabel="+28 esta semana"
                  sparkline={[240, 258, 268, 278, 288, 302, 312]} />
              </div>

              {/* Grid principal */}
              <div className="section-grid" style={{ marginBottom: 'var(--space-6)' }}>

                {/* Engajamento por área */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Engajamento por Área</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => setActive('relatorios')}><Icon name="trending" size={14} /></button>
                  </div>
                  <ProgressRow label="Tecnologia" value={92} total={100} color="var(--color-primary)" />
                  <ProgressRow label="Assistência" value={78} total={100} color="var(--color-info)" />
                  <ProgressRow label="RH" value={85} total={100} color="var(--color-success)" />
                  <ProgressRow label="Segurança" value={61} total={100} color="var(--color-warning)" />
                  <ProgressRow label="Administrativo" value={70} total={100} color="var(--color-admin)" />
                  <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Média geral</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>76%</span>
                  </div>
                </div>

                {/* Atividade recente */}
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Atividade Recente</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>Ao vivo</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {MOCK_ATIVIDADES.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: i < MOCK_ATIVIDADES.length - 1 ? '1px solid var(--color-divider)' : 'none', alignItems: 'flex-start' }}>
                        <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 'var(--text-xs)', flexShrink: 0 }}>{a.avatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                            <strong>{a.usuario}</strong> {a.acao} <em style={{ color: 'var(--color-primary)' }}>{a.curso}</em>
                          </p>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{a.tempo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cursos — tabela resumida */}
              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="section-header">
                  <span className="section-title">Cursos em Destaque</span>
                  <button className="btn btn-sm btn-primary" onClick={() => setActive('cursos')}>
                    Ver todos
                  </button>
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
                      {MOCK_CURSOS.map(c => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{c.titulo}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {c.obrigatorio ? '• Obrigatório' : '• Opcional'}
                            </div>
                          </td>
                          <td><span className="badge badge-primary">{c.categoria}</span></td>
                          <td style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-muted)' }}>{c.carga}h</td>
                          <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{c.matriculas}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 120 }}>
                              <div className="progress-bar" style={{ flex: 1 }}>
                                <div className="progress-fill" style={{ width: `${c.conclusao}%`,
                                  background: c.conclusao >= 70 ? 'var(--color-success)' : c.conclusao >= 40 ? 'var(--color-warning)' : 'var(--color-error)' }} />
                              </div>
                              <span style={{ fontSize: 'var(--text-xs)', minWidth: 32, textAlign: 'right' }}>{c.conclusao}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'publicado' ? 'badge-success' : 'badge-warning'}`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trilhas + Alertas */}
              <div className="section-grid">
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Trilhas Ativas</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setActive('trilhas')}>Gerenciar</button>
                  </div>
                  {MOCK_TRILHAS.map(t => (
                    <div key={t.id} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{t.titulo}</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.cursos} cursos · {t.usuarios} inscritos</p>
                        </div>
                        <span className={`badge ${t.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${t.progresso}%` }} />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', minWidth: 32 }}>{t.progresso}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Alertas e Pendências</span>
                    <span className="badge badge-error">{MOCK_ALERTAS.length}</span>
                  </div>
                  {MOCK_ALERTAS.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: i < MOCK_ALERTAS.length - 1 ? '1px solid var(--color-divider)' : 'none' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                        background: a.urgente ? 'var(--color-error)' : 'var(--color-warning)' }} />
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6 }}>{a.texto}</p>
                    </div>
                  ))}
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-4)', justifyContent: 'center' }}
                    onClick={() => setActive('notificacoes')}>
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ═══════════ USUÁRIOS ═══════════ */}
          {active === 'usuarios' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Usuários</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{MOCK_USERS.length} usuários cadastrados</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary"><Icon name="download" size={16} /> Exportar CSV</button>
                  <button className="btn btn-primary" onClick={() => setModalUsuario(true)}><Icon name="plus" size={16} /> Novo Usuário</button>
                </div>
              </div>

              {/* Filtros */}
              <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: '1 1 240px' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)' }}><Icon name="search" size={16} /></span>
                    <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Buscar por nome ou área..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  {['todos', 'ativo', 'inativo'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ textTransform: 'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Usuário</th><th>Perfil</th><th>Área</th><th>Cursos</th><th>Último Acesso</th><th>Status</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 'var(--text-sm)',
                                background: u.perfil === 'gestor' ? 'var(--color-gestor)' : 'var(--color-primary)' }}>
                                {u.nome.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{u.nome}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className={`badge ${u.perfil === 'gestor' ? 'badge-gestor' : 'badge-primary'}`}>{u.perfil}</span></td>
                          <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{u.area}</td>
                          <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{u.cursos_concluidos}</td>
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.ultimo_acesso}</td>
                          <td><span className={`badge ${u.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                              <button className="btn btn-ghost" style={{ padding: 'var(--space-1)' }} title="Editar"><Icon name="edit" size={15} /></button>
                              <button className="btn btn-ghost" style={{ padding: 'var(--space-1)', color: 'var(--color-error)' }} title="Remover"><Icon name="trash" size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ═══════════ CURSOS ═══════════ */}
          {active === 'cursos' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Catálogo de Cursos</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{MOCK_CURSOS.length} cursos cadastrados</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalCurso(true)}><Icon name="plus" size={16} /> Novo Curso</button>
              </div>

              <div className="courses-grid">
                {MOCK_CURSOS.map(c => (
                  <div key={c.id} className="course-card">
                    <div className="course-thumb" style={{ background: c.status === 'rascunho' ? 'var(--color-surface-offset)' : 'var(--color-primary-light)' }}>
                      <div style={{ color: 'var(--color-primary)' }}><Icon name="book" size={40} /></div>
                      {c.obrigatorio && (
                        <span style={{ position: 'absolute', top: 12, right: 12 }} className="badge badge-error">Obrigatório</span>
                      )}
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
                      {c.conclusao > 0 && (
                        <>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${c.conclusao}%`,
                              background: c.conclusao >= 70 ? 'var(--color-success)' : 'var(--color-warning)' }} />
                          </div>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{c.conclusao}% concluído</p>
                        </>
                      )}
                      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                        <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}><Icon name="edit" size={14} /> Editar</button>
                        <button className="btn btn-sm btn-ghost" title="Visualizar"><Icon name="eye" size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ TRILHAS ═══════════ */}
          {active === 'trilhas' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h2 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Trilhas de Aprendizagem</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{MOCK_TRILHAS.length} trilhas ativas</p>
                </div>
                <button className="btn btn-primary"><Icon name="plus" size={16} /> Nova Trilha</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {MOCK_TRILHAS.map(t => (
                  <div key={t.id} className="card" style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ width: 48, height: 48, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                        <Icon name="map" size={22} />
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-2)' }}>
                          <h3 style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{t.titulo}</h3>
                          <span className={`badge ${t.status === 'ativo' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}><strong>{t.cursos}</strong> cursos</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}><strong>{t.usuarios}</strong> inscritos</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${t.progresso}%` }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, minWidth: 40, color: 'var(--color-primary)' }}>{t.progresso}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                        <button className="btn btn-sm btn-secondary"><Icon name="edit" size={14} /> Editar</button>
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--color-error)' }}><Icon name="trash" size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ CERTIFICADOS ═══════════ */}
          {active === 'certificados' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Certificados Emitidos</h2>
              <p className="page-subtitle">312 certificados emitidos · 5 aguardando aprovação</p>
              <div className="section-grid">
                {[{ nome: 'Ana Souza', curso: 'LGPD e Proteção de Dados', data: '03/07/2026', status: 'emitido' },
                  { nome: 'Beatriz Melo', curso: 'Integração e Onboarding', data: '02/07/2026', status: 'emitido' },
                  { nome: 'Carlos Lima', curso: 'NR-32 Segurança Hospitalar', data: '01/07/2026', status: 'pendente' },
                  { nome: 'Ricardo Neves', curso: 'Atendimento ao Paciente', data: '30/06/2026', status: 'emitido' },
                ].map((cert, i) => (
                  <div key={i} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                      <div className="user-avatar" style={{ width: 40, height: 40 }}>{cert.nome.charAt(0)}</div>
                      <span className={`badge ${cert.status === 'emitido' ? 'badge-success' : 'badge-warning'}`}>{cert.status}</span>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{cert.nome}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{cert.curso}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{cert.data}</span>
                      <button className="btn btn-sm btn-primary"><Icon name="download" size={13} /> Baixar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ NOTIFICAÇÕES ═══════════ */}
          {active === 'notificacoes' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Central de Notificações</h2>
              <p className="page-subtitle">Alertas, lembretes e comunicados</p>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <span className="section-title">Alertas Recentes</span>
                  <button className="btn btn-sm btn-primary"><Icon name="bell" size={14} /> Enviar Notificação</button>
                </div>
                {MOCK_ALERTAS.map((a, i) => (
                  <div key={i} className="notif-item">
                    <div className={`notif-dot ${a.urgente ? '' : 'read'}`} />
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)' }}>{a.texto}</p>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>Hoje · {a.tipo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ RELATÓRIOS ═══════════ */}
          {active === 'relatorios' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Relatórios</h2>
              <p className="page-subtitle">Exporte dados da plataforma em CSV ou PDF</p>
              <div className="section-grid">
                {[
                  { titulo: 'Progresso por Colaborador', descricao: 'Taxa de conclusão, tempo médio e cursos pendentes por usuário', icon: 'users' },
                  { titulo: 'Cursos e Engajamento', descricao: 'Matrículas, conclusões e avaliações por curso', icon: 'book' },
                  { titulo: 'Trilhas de Aprendizagem', descricao: 'Progresso consolidado por trilha e área', icon: 'map' },
                  { titulo: 'Certificados Emitidos', descricao: 'Histórico completo de certificações', icon: 'award' },
                  { titulo: 'Treinamentos Vencendo', descricao: 'Lista de colaboradores com prazos próximos', icon: 'clock' },
                  { titulo: 'Auditoria de Acesso', descricao: 'Log de logins, ações e alterações na plataforma', icon: 'list' },
                ].map((r, i) => (
                  <div key={i} className="card" style={{ cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                      <Icon name={r.icon} size={20} />
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>{r.titulo}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{r.descricao}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-sm btn-primary"><Icon name="download" size={13} /> CSV</button>
                      <button className="btn btn-sm btn-secondary"><Icon name="download" size={13} /> PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════ CONFIGURAÇÕES ═══════════ */}
          {active === 'configuracoes' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Configurações</h2>
              <p className="page-subtitle">Ajustes gerais da plataforma</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 600 }}>
                {[
                  { label: 'Nome da Plataforma', value: 'Plataforma de Treinamentos' },
                  { label: 'E-mail de suporte', value: 'treinamentos@hospital.com' },
                  { label: 'Prazo padrão de vencimento (dias)', value: '365' },
                ].map((field, i) => (
                  <div key={i} className="card">
                    <div className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input className="form-input" defaultValue={field.value} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Icon name="check" size={16} /> Salvar Configurações
                </button>
              </div>
            </>
          )}

          {/* ═══════════ AVALIAÇÕES ═══════════ */}
          {active === 'avaliacoes' && (
            <>
              <h2 className="page-title" style={{ marginBottom: 'var(--space-2)' }}>Avaliações</h2>
              <p className="page-subtitle">Questionários vinculados aos cursos</p>
              <div className="card">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Avaliação</th><th>Curso</th><th>Perguntas</th><th>Nota mínima</th><th>Tentativas</th><th>Ações</th></tr></thead>
                    <tbody>
                      {MOCK_CURSOS.filter(c => c.status === 'publicado').map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 500 }}>Avaliação: {c.titulo}</td>
                          <td><span className="badge badge-primary">{c.categoria}</span></td>
                          <td style={{ fontVariantNumeric: 'tabular-nums' }}>10</td>
                          <td style={{ fontVariantNumeric: 'tabular-nums' }}>70%</td>
                          <td style={{ fontVariantNumeric: 'tabular-nums' }}>3</td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-sm btn-secondary"><Icon name="edit" size={13} /> Editar</button>
                              <button className="btn btn-sm btn-ghost" style={{ color: 'var(--color-error)' }}><Icon name="trash" size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  )
}
