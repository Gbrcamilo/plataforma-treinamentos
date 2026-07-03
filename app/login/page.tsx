'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const USUARIOS = [
  { email: 'admin@hospital.com',        senha: '123456', perfil: 'admin',        nome: 'Admin Sistema',    rota: '/admin' },
  { email: 'gestor@hospital.com',       senha: '123456', perfil: 'gestor',       nome: 'Maria Gestora',    rota: '/gestor' },
  { email: 'colaborador@hospital.com',  senha: '123456', perfil: 'colaborador',  nome: 'João Pereira',     rota: '/colaborador' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]         = useState('')
  const [senha, setSenha]         = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [erro, setErro]           = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusSenha, setFocusSenha] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!email || !senha) { setErro('Preencha e-mail e senha.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const user = USUARIOS.find(u => u.email === email.trim().toLowerCase() && u.senha === senha)
    if (!user) {
      setLoading(false)
      setErro('E-mail ou senha incorretos. Verifique os dados e tente novamente.')
      return
    }
    router.push(user.rota)
  }

  const preencherDemo = (perfil: string) => {
    const u = USUARIOS.find(u => u.perfil === perfil)!
    setEmail(u.email)
    setSenha(u.senha)
    setErro('')
  }

  const corPerfil = (p: string) =>
    p === 'admin' ? '#6366f1' : p === 'gestor' ? '#8b5cf6' : '#10b981'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: '#0f172a',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* FUNDO ANIMADO */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{
          position:'absolute', top:'-20%', left:'-10%',
          width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation:'pulse1 8s ease-in-out infinite',
        }}/>
        <div style={{
          position:'absolute', bottom:'-15%', right:'-5%',
          width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          animation:'pulse2 10s ease-in-out infinite',
        }}/>
        <div style={{
          position:'absolute', top:'40%', right:'30%',
          width:300, height:300, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          animation:'pulse1 12s ease-in-out infinite reverse',
        }}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes pulse1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(20px,-20px)} }
        @keyframes pulse2 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(-15px,15px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-card { animation: fadeUp 0.5s ease forwards; }
        .input-field {
          width:100%; padding:12px 16px; border-radius:10px;
          background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.1);
          color:white; font-size:14px; outline:none; box-sizing:border-box;
          transition:border-color 0.2s, background 0.2s;
        }
        .input-field::placeholder { color:rgba(255,255,255,0.3); }
        .input-field:focus { border-color:#6366f1; background:rgba(99,102,241,0.08); }
        .btn-login {
          width:100%; padding:13px; border-radius:10px; border:none;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:white; font-size:15px; font-weight:700;
          cursor:pointer; transition:opacity 0.2s, transform 0.15s;
          letter-spacing:0.02em;
        }
        .btn-login:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
        .btn-login:active:not(:disabled) { transform:translateY(0); }
        .btn-login:disabled { opacity:0.6; cursor:not-allowed; }
        .demo-btn {
          flex:1; padding:8px 6px; border-radius:8px; border:none;
          font-size:11px; font-weight:600; cursor:pointer;
          transition:opacity 0.15s, transform 0.15s;
          letter-spacing:0.03em;
        }
        .demo-btn:hover { opacity:0.85; transform:translateY(-1px); }
      `}</style>

      {/* PAINEL ESQUERDO — visível em telas grandes */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'60px 48px', position:'relative',
        '@media(max-width:768px)':{ display:'none' } as any,
      }} className="left-panel">
        <style>{`.left-panel { display:none; } @media(min-width:900px){ .left-panel{ display:flex!important; } }`}</style>

        {/* LOGO GRANDE */}
        <div style={{ marginBottom:48, textAlign:'center' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{margin:'0 auto 20px'}}>
            <rect width="80" height="80" rx="20" fill="url(#logoGrad)"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <path d="M24 30h32M24 40h24M24 50h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="56" cy="50" r="10" fill="none" stroke="#a5f3fc" strokeWidth="2.5"/>
            <path d="M62 56l4 4" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <h1 style={{ fontSize:32, fontWeight:800, color:'white', margin:'0 0 8px', letterSpacing:'-0.02em' }}>Plataforma de Treinamentos</h1>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:360, lineHeight:1.6, margin:'0 auto' }}>
            Gerencie treinamentos, trilhas de aprendizado e certificados da sua equipe em um só lugar.
          </p>
        </div>

        {/* CARDS DE PERFIL */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, width:'100%', maxWidth:380 }}>
          {[
            { perfil:'Administrador', desc:'Gestão completa da plataforma', cor:'#6366f1', icon:(
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/><path d="M12 14v7M9 17h6"/></svg>
            )},
            { perfil:'Gestor', desc:'Acompanhe sua equipe e relatórios', cor:'#8b5cf6', icon:(
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            )},
            { perfil:'Colaborador', desc:'Seus cursos, trilhas e certificados', cor:'#10b981', icon:(
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            )},
          ].map(p => (
            <div key={p.perfil} style={{
              display:'flex', alignItems:'center', gap:14,
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:12, padding:'16px 20px',
            }}>
              <div style={{ width:44, height:44, borderRadius:10, background:`${p.cor}22`, display:'flex', alignItems:'center', justifyContent:'center', color:p.cor, flexShrink:0 }}>
                {p.icon}
              </div>
              <div>
                <div style={{ color:'white', fontWeight:600, fontSize:14 }}>{p.perfil}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIVISOR VERTICAL */}
      <div className="divider" style={{ width:1, background:'rgba(255,255,255,0.06)', margin:'40px 0' }}>
        <style>{`.divider { display:none; } @media(min-width:900px){ .divider{ display:block!important; } }`}</style>
      </div>

      {/* PAINEL DIREITO — FORMULÁRIO */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'40px 24px',
        flex: '0 0 auto',
        width: '100%',
      }} className="right-panel">
        <style>{`
          .right-panel { max-width:100%; }
          @media(min-width:900px){ .right-panel{ width:440px!important; flex:0 0 440px!important; } }
        `}</style>

        <div className="login-card" style={{ width:'100%', maxWidth:400 }}>

          {/* LOGO PEQUENO — só mobile */}
          <div className="mobile-logo" style={{ textAlign:'center', marginBottom:32 }}>
            <style>{`.mobile-logo { display:block; } @media(min-width:900px){ .mobile-logo{ display:none!important; } }`}</style>
            <svg width="52" height="52" viewBox="0 0 80 80" fill="none" style={{margin:'0 auto 12px'}}>
              <rect width="80" height="80" rx="20" fill="url(#logoGradSm)"/>
              <defs><linearGradient id="logoGradSm" x1="0" y1="0" x2="80" y2="80"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
              <path d="M24 30h32M24 40h24M24 50h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="56" cy="50" r="10" fill="none" stroke="#a5f3fc" strokeWidth="2.5"/>
              <path d="M62 56l4 4" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div style={{ color:'white', fontWeight:700, fontSize:18 }}>Plataforma de Treinamentos</div>
          </div>

          {/* HEADER */}
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:26, fontWeight:800, color:'white', margin:'0 0 6px', letterSpacing:'-0.01em' }}>Bem-vindo de volta</h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, margin:0 }}>Acesse com seu e-mail e senha corporativos</p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} noValidate>
            {/* EMAIL */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:8, letterSpacing:'0.02em' }}>E-MAIL CORPORATIVO</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setErro('') }}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  placeholder="seu@hospital.com"
                  className="input-field"
                  style={{ paddingLeft:44 }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* SENHA */}
            <div style={{ marginBottom:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', letterSpacing:'0.02em' }}>SENHA</label>
                <button type="button" style={{ background:'none', border:'none', color:'#a5b4fc', fontSize:12, cursor:'pointer', fontWeight:500 }}>Esqueceu a senha?</button>
              </div>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro('') }}
                  onFocus={() => setFocusSenha(true)}
                  onBlur={() => setFocusSenha(false)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft:44, paddingRight:44 }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:0 }}>
                  {mostrarSenha
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* ERRO */}
            {erro && (
              <div style={{
                background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
                borderRadius:8, padding:'10px 14px', marginBottom:20,
                color:'#fca5a5', fontSize:13, display:'flex', alignItems:'center', gap:8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {erro}
              </div>
            )}

            {/* BOTÃO */}
            <button type="submit" disabled={loading} className="btn-login">
              {loading
                ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Entrando...
                  </span>
                : 'Entrar na plataforma'
              }
            </button>
          </form>

          {/* ACESSO RÁPIDO DEMO */}
          <div style={{ marginTop:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12, whiteSpace:'nowrap' }}>Acesso demo</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { label:'Admin', perfil:'admin', cor:'#6366f1' },
                { label:'Gestor', perfil:'gestor', cor:'#8b5cf6' },
                { label:'Colaborador', perfil:'colaborador', cor:'#10b981' },
              ].map(d => (
                <button key={d.perfil} onClick={() => preencherDemo(d.perfil)} className="demo-btn"
                  style={{ background:`${d.cor}22`, color:d.cor, border:`1px solid ${d.cor}44` }}>
                  {d.label}
                </button>
              ))}
            </div>
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11, textAlign:'center', marginTop:10 }}>Clique para preencher credenciais de demonstração</p>
          </div>

          {/* RODAPÉ */}
          <div style={{ marginTop:32, textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.15)', fontSize:11 }}>© 2026 Plataforma de Treinamentos · Uso interno</p>
          </div>
        </div>
      </div>
    </div>
  )
}
