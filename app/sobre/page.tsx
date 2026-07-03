'use client'
import { useRouter } from 'next/navigation'

const perfis = [
  {
    id: 'gestor',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    label: 'Gestor',
    titulo: 'Visão da equipe e acompanhamento',
    descricao: 'Coordenadores e líderes que acompanham aderência, atrasos e desenvolvimento do time.',
    cor: '#8b5cf6',
    corFundo: 'rgba(139,92,246,0.12)',
    items: [
      'Ver equipe direta e trilhas obrigatórias por colaborador.',
      'Acompanhar pendências, notas, horas treinadas e ranking.',
      'Receber alertas de atraso e reciclagem próxima do vencimento.',
      'Indicar cursos extras e validar conclusão prática.',
    ],
  },
  {
    id: 'colaborador',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M6 8h12M6 12h8"/>
      </svg>
    ),
    label: 'Colaborador',
    titulo: 'Aprendizagem simples e objetiva',
    descricao: 'Execução rápida no desktop ou celular, com foco em estudar, concluir e acompanhar progresso.',
    cor: '#10b981',
    corFundo: 'rgba(16,185,129,0.12)',
    items: [
      'Dashboard pessoal com cursos pendentes, em andamento e concluídos.',
      'Acessar aulas, materiais, avaliações e certificados.',
      'Receber recomendações e ver trilha por cargo ou área.',
      'Filtrar por prazo, tipo de conteúdo e prioridade.',
    ],
  },
  {
    id: 'admin',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Administrador',
    titulo: 'Gestão completa da plataforma',
    descricao: 'Controle total sobre usuários, cursos, trilhas, relatórios e configurações do sistema.',
    cor: '#6366f1',
    corFundo: 'rgba(99,102,241,0.12)',
    items: [
      'Criar e gerenciar usuários, perfis e setores.',
      'Publicar cursos, trilhas obrigatórias e complementares.',
      'Emitir certificados e configurar validade por cargo.',
      'Exportar relatórios completos por área ou colaborador.',
    ],
  },
]

export default function SobrePage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .card-perfil { animation: fadeUp 0.5s ease forwards; transition: transform 0.2s, box-shadow 0.2s; }
        .card-perfil:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4) !important; }
        .btn-acesso:hover { opacity: 0.88; transform: translateY(-1px); }
        .item-bullet::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 10px; flex-shrink: 0; margin-top: 7px; }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
            <rect width="80" height="80" rx="16" fill="url(#hg)"/>
            <defs><linearGradient id="hg" x1="0" y1="0" x2="80" y2="80"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
            <path d="M24 30h32M24 40h24M24 50h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="56" cy="50" r="10" fill="none" stroke="#a5f3fc" strokeWidth="2.5"/>
            <path d="M62 56l4 4" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>HDS — Treinamentos</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Sistema de Gestão Hospitalar</div>
          </div>
        </div>
        <button
          onClick={() => router.push('/login')}
          style={{ padding: '9px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >Acessar plataforma →</button>
      </header>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '72px 40px 48px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 99, padding: '4px 16px', fontSize: 12, color: '#a5b4fc', fontWeight: 600, marginBottom: 20, letterSpacing: '0.05em' }}>
          PLATAFORMA HDS
        </div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Treinamentos que fazem<br/>
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>a diferença na saúde</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Gerencie cursos, trilhas obrigatórias, avaliações e certificados em um sistema pensado para maternidades e equipes de saúde.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn-acesso"
          style={{ display: 'inline-block', padding: '13px 32px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}
        >Começar agora</button>
      </section>

      {/* CARDS DE PERFIS */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 40 }}>O que cada perfil pode fazer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {perfis.map((p, idx) => (
            <div
              key={p.id}
              className="card-perfil"
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '28px',
                animationDelay: `${idx * 0.1}s`,
                animationFillMode: 'both',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              {/* Badge */}
              <div style={{ marginBottom: 20 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: p.corFundo,
                  color: p.cor,
                  border: `1px solid ${p.cor}33`,
                  borderRadius: 8, padding: '5px 12px',
                  fontSize: 13, fontWeight: 700,
                }}>
                  <span style={{ color: p.cor }}>{p.icon}</span>
                  {p.label}
                </span>
              </div>

              {/* Título */}
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 10px', lineHeight: 1.3 }}>{p.titulo}</h3>

              {/* Descrição */}
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px' }}>{p.descricao}</p>

              {/* Items */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.items.map((item, i) => (
                  <li key={i} className="item-bullet" style={{ display: 'flex', alignItems: 'flex-start', fontSize: 14, color: '#cbd5e1' }}>
                    <span style={{ color: p.cor, display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.cor, display: 'inline-block', marginRight: 10, marginTop: 7, flexShrink: 0 }} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 12 }}>© 2026 HDS — Uso interno · Sistema de Gestão de Treinamentos Hospitalares</p>
      </footer>
    </div>
  )
}
