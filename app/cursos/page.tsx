'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Curso {
  id: string
  titulo: string
  descricao: string
  categoria: string
  carga_horaria: number
  nivel: string
  obrigatorio: boolean
  thumbnail_url?: string
  meu_status?: string
  meu_progresso?: number
  total_matriculas?: number
}

const COR_NIVEL: Record<string, string> = { basico: '#10b981', intermediario: '#f59e0b', avancado: '#ef4444' }
const COR_CATEGORIA: Record<string, string> = {
  'Segurança': '#6366f1', 'Higiene': '#06b6d4', 'Protocolos': '#8b5cf6',
  'Gestão': '#f59e0b', 'Técnico': '#10b981', 'Onboarding': '#ec4899',
}

export default function CursosPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [buscando, setBuscando] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!user) return
    const qs = new URLSearchParams()
    if (busca) qs.set('busca', busca)
    if (categoriaFiltro) qs.set('categoria', categoriaFiltro)
    setBuscando(true)
    fetch(`/api/cursos?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setCursos(d.cursos || []); setBuscando(false) })
      .catch(() => { setErro('Erro ao carregar cursos'); setBuscando(false) })
  }, [user, busca, categoriaFiltro])

  const matricular = async (cursoId: string) => {
    await fetch('/api/matriculas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ curso_id: cursoId }),
    })
    router.push(`/cursos/${cursoId}`)
  }

  if (loading) return <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>Carregando...</div>

  const categorias = Array.from(new Set(cursos.map(c => c.categoria))).filter(Boolean)

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        .curso-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; transition:transform 0.2s,border-color 0.2s; cursor:pointer; }
        .curso-card:hover { transform:translateY(-4px); border-color:rgba(99,102,241,0.4); }
        .btn-cat { padding:6px 14px; border-radius:20px; border:none; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .input-busca { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; color:white; padding:10px 16px 10px 40px; font-size:14px; outline:none; width:100%; box-sizing:border-box; }
        .input-busca::placeholder { color:rgba(255,255,255,0.3); }
        .input-busca:focus { border-color:#6366f1; }
        .btn-acao { padding:8px 16px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:opacity 0.15s, transform 0.15s; }
        .btn-acao:hover { opacity:0.85; transform:translateY(-1px); }
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.push(`/${user?.perfil}`)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Dashboard
            </button>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color:'white', fontWeight:600, fontSize:14 }}>Cursos</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:14 }}>{user?.nome}</span>
            <button onClick={logout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Sair</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px' }}>
        {/* TÍTULO + BUSCA */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Cursos Disponíveis</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:14 }}>{cursos.length} curso{cursos.length !== 1 ? 's' : ''} encontrado{cursos.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ position:'relative', minWidth:260 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="input-busca" placeholder="Buscar cursos..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
        </div>

        {/* FILTROS CATEGORIA */}
        {categorias.length > 0 && (
          <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
            <button className="btn-cat" onClick={() => setCategoriaFiltro('')} style={{ background: !categoriaFiltro ? '#6366f1' : 'rgba(255,255,255,0.06)', color: !categoriaFiltro ? 'white' : 'rgba(255,255,255,0.5)', border: !categoriaFiltro ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>Todos</button>
            {categorias.map(cat => (
              <button key={cat} className="btn-cat" onClick={() => setCategoriaFiltro(cat === categoriaFiltro ? '' : cat)} style={{ background: categoriaFiltro === cat ? (COR_CATEGORIA[cat] || '#6366f1') : 'rgba(255,255,255,0.06)', color: categoriaFiltro === cat ? 'white' : 'rgba(255,255,255,0.5)', border: categoriaFiltro === cat ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>{cat}</button>
            ))}
          </div>
        )}

        {/* ERRO */}
        {erro && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', color:'#fca5a5', marginBottom:24 }}>{erro}</div>}

        {/* LOADING */}
        {buscando && (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        )}

        {/* GRID DE CURSOS */}
        {!buscando && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
            {cursos.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin:'0 auto 16px', display:'block', opacity:0.3}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Nenhum curso encontrado
              </div>
            )}
            {cursos.map(curso => (
              <div key={curso.id} className="curso-card" onClick={() => router.push(`/cursos/${curso.id}`)}>
                {/* THUMBNAIL */}
                <div style={{ height:140, background:`linear-gradient(135deg, ${COR_CATEGORIA[curso.categoria] || '#6366f1'}33, ${COR_CATEGORIA[curso.categoria] || '#8b5cf6'}22)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                  {curso.thumbnail_url
                    ? <img src={curso.thumbnail_url} alt={curso.titulo} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COR_CATEGORIA[curso.categoria] || '#6366f1'} strokeWidth="1.5" opacity={0.6}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  }
                  {curso.obrigatorio && (
                    <span style={{ position:'absolute', top:10, right:10, background:'#ef4444', color:'white', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, letterSpacing:'0.05em' }}>OBRIGATÓRIO</span>
                  )}
                  {curso.meu_status === 'concluido' && (
                    <span style={{ position:'absolute', top:10, left:10, background:'#10b981', color:'white', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>CONCLUÍDO</span>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div style={{ padding:'16px 20px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <span style={{ background:`${COR_CATEGORIA[curso.categoria] || '#6366f1'}22`, color:COR_CATEGORIA[curso.categoria] || '#6366f1', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{curso.categoria}</span>
                    <span style={{ background:`${COR_NIVEL[curso.nivel] || '#6366f1'}22`, color:COR_NIVEL[curso.nivel] || '#6366f1', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{curso.nivel}</span>
                  </div>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:'0 0 6px', lineHeight:1.4, color:'white' }}>{curso.titulo}</h3>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'0 0 14px', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{curso.descricao}</p>

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>{curso.carga_horaria}h</span>
                    {curso.total_matriculas !== undefined && (
                      <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>{curso.total_matriculas} matrículas</span>
                    )}
                  </div>

                  {curso.meu_progresso !== undefined && curso.meu_progresso > 0 && (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Progresso</span>
                        <span style={{ fontSize:12, color:'#6366f1', fontWeight:600 }}>{curso.meu_progresso}%</span>
                      </div>
                      <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                        <div style={{ height:'100%', width:`${curso.meu_progresso}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:2, transition:'width 0.5s' }} />
                      </div>
                    </div>
                  )}

                  <button
                    className="btn-acao"
                    style={{ marginTop:16, width:'100%', background: curso.meu_status === 'concluido' ? 'rgba(16,185,129,0.15)' : curso.meu_status ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: curso.meu_status === 'concluido' ? '#10b981' : 'white', border: curso.meu_status && curso.meu_status !== 'concluido' ? '1px solid rgba(99,102,241,0.4)' : 'none' }}
                    onClick={e => { e.stopPropagation(); curso.meu_status ? router.push(`/cursos/${curso.id}`) : matricular(curso.id) }}
                  >
                    {curso.meu_status === 'concluido' ? 'Ver certificado' : curso.meu_status ? 'Continuar curso' : 'Iniciar curso'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
