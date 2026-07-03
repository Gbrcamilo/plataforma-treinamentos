'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Usuario {
  id: string
  nome: string
  email: string
  perfil: string
  area: string
  cargo: string
  ativo: boolean
  ultimo_acesso: string
  criado_em: string
}

const CORES_PERFIL: Record<string, string> = { admin:'#6366f1', gestor:'#8b5cf6', colaborador:'#10b981' }

export default function UsuariosPage() {
  const { user, loading, logout } = useAuth('admin')
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [novo, setNovo] = useState({ nome:'', email:'', senha:'', perfil:'colaborador', area:'', cargo:'' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const carregar = () => {
    const qs = new URLSearchParams()
    if (busca) qs.set('busca', busca)
    if (filtroPerfil) qs.set('perfil', filtroPerfil)
    setBuscando(true)
    fetch(`/api/usuarios?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setUsuarios(d.usuarios || []); setBuscando(false) })
      .catch(() => setBuscando(false))
  }

  useEffect(() => { if (user) carregar() }, [user, busca, filtroPerfil])

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(''); setSucesso(''); setSalvando(true)
    const res = await fetch('/api/usuarios', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify(novo)
    })
    const data = await res.json()
    setSalvando(false)
    if (!res.ok) { setErro(data.error || 'Erro ao criar usuário'); return }
    setSucesso('Usuário criado com sucesso!')
    setNovo({ nome:'', email:'', senha:'', perfil:'colaborador', area:'', cargo:'' })
    carregar()
    setTimeout(() => { setModalAberto(false); setSucesso('') }, 1500)
  }

  if (loading) return <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>Carregando...</div>

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .input-f { width:100%; padding:10px 14px; border-radius:8px; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.1); color:white; font-size:14px; outline:none; box-sizing:border-box; }
        .input-f::placeholder{color:rgba(255,255,255,0.3);}
        .input-f:focus{border-color:#6366f1;background:rgba(99,102,241,0.06);}
        select.input-f option{background:#1e1b4b;}
        .tr-row:hover td{background:rgba(255,255,255,0.03);}
        .btn-primary{padding:10px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:13px;font-weight:600;cursor:pointer;transition:opacity 0.15s,transform 0.15s;}
        .btn-primary:hover{opacity:0.9;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.push('/admin')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Dashboard
            </button>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color:'white', fontWeight:600, fontSize:14 }}>Usuários</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => setModalAberto(true)} className="btn-primary">
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo usuário
              </span>
            </button>
            <button onClick={logout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Sair</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px' }}>
        {/* FILTROS */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="input-f" style={{ paddingLeft:36 }} placeholder="Buscar por nome..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
          <select className="input-f" style={{ width:'auto', minWidth:160 }} value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)}>
            <option value="">Todos os perfis</option>
            <option value="admin">Admin</option>
            <option value="gestor">Gestor</option>
            <option value="colaborador">Colaborador</option>
          </select>
        </div>

        {/* TABELA */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(255,255,255,0.04)' }}>
                {['Nome','E-mail','Perfil','Área','Cargo','Status','Último acesso'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.08em', textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buscando && (
                <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite', display:'inline-block'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </td></tr>
              )}
              {!buscando && usuarios.length === 0 && (
                <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14 }}>Nenhum usuário encontrado</td></tr>
              )}
              {!buscando && usuarios.map(u => (
                <tr key={u.id} className="tr-row">
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:`${CORES_PERFIL[u.perfil] || '#6366f1'}22`, display:'flex', alignItems:'center', justifyContent:'center', color:CORES_PERFIL[u.perfil] || '#6366f1', fontSize:13, fontWeight:700, flexShrink:0 }}>{u.nome[0]?.toUpperCase()}</div>
                      <span style={{ fontSize:14, fontWeight:500 }}>{u.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13, color:'rgba(255,255,255,0.5)' }}>{u.email}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ background:`${CORES_PERFIL[u.perfil] || '#6366f1'}22`, color:CORES_PERFIL[u.perfil] || '#6366f1', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, textTransform:'capitalize' }}>{u.perfil}</span>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13, color:'rgba(255,255,255,0.5)' }}>{u.area || '—'}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13, color:'rgba(255,255,255,0.5)' }}>{u.cargo || '—'}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ background: u.ativo ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', color: u.ativo ? '#6ee7b7' : '#fca5a5', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                  </td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:12, color:'rgba(255,255,255,0.3)' }}>{u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop:12, color:'rgba(255,255,255,0.25)', fontSize:12 }}>{usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''}</div>
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {modalAberto && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, animation:'fadeIn 0.2s' }}>
          <div style={{ background:'#1c1b19', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'32px', width:'100%', maxWidth:480, animation:'slideUp 0.25s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>Novo Usuário</h3>
              <button onClick={() => { setModalAberto(false); setErro(''); setSucesso('') }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
            </div>
            <form onSubmit={criarUsuario}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>NOME COMPLETO</label>
                  <input required className="input-f" value={novo.nome} onChange={e => setNovo(p=>({...p,nome:e.target.value}))} placeholder="Nome completo" />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>E-MAIL</label>
                  <input required type="email" className="input-f" value={novo.email} onChange={e => setNovo(p=>({...p,email:e.target.value}))} placeholder="email@hospital.com" />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>SENHA INICIAL</label>
                  <input required className="input-f" type="password" value={novo.senha} onChange={e => setNovo(p=>({...p,senha:e.target.value}))} placeholder="Mínimo 6 caracteres" />
                </div>
                <div>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>PERFIL</label>
                  <select className="input-f" value={novo.perfil} onChange={e => setNovo(p=>({...p,perfil:e.target.value}))}>
                    <option value="colaborador">Colaborador</option>
                    <option value="gestor">Gestor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>ÁREA</label>
                  <input className="input-f" value={novo.area} onChange={e => setNovo(p=>({...p,area:e.target.value}))} placeholder="Ex: Enfermagem" />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, display:'block', marginBottom:6 }}>CARGO</label>
                  <input className="input-f" value={novo.cargo} onChange={e => setNovo(p=>({...p,cargo:e.target.value}))} placeholder="Ex: Enfermeiro Sênior" />
                </div>
              </div>
              {erro && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#fca5a5', fontSize:13, marginBottom:14 }}>{erro}</div>}
              {sucesso && <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:8, padding:'10px 14px', color:'#6ee7b7', fontSize:13, marginBottom:14 }}>{sucesso}</div>}
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding:'10px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13, fontWeight:600 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Criar usuário'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
