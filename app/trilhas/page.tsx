'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface CursoTrilha { id: string; titulo: string; carga_horaria: number; nivel: string; obrigatorio: boolean }
interface Trilha {
  id: string
  titulo: string
  descricao: string
  publico_alvo: string
  prazo_dias: number
  total_cursos: number
  cursos: CursoTrilha[]
  ativo: boolean
}

const COR_NIVEL: Record<string,string> = { basico:'#10b981', intermediario:'#f59e0b', avancado:'#ef4444' }

export default function TrilhasPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [buscando, setBuscando] = useState(true)
  const [expandida, setExpandida] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    fetch('/api/trilhas', { credentials:'include' })
      .then(r => r.json())
      .then(d => { setTrilhas(d.trilhas || []); setBuscando(false) })
      .catch(() => setBuscando(false))
  }, [user])

  if (loading) return <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>Carregando...</div>

  const chTotal = (t: Trilha) => (t.cursos || []).filter(Boolean).reduce((s, c) => s + (c?.carga_horaria || 0), 0)

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .trilha-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; transition:border-color 0.2s; animation:fadeUp 0.4s ease; }
        .trilha-card:hover { border-color:rgba(139,92,246,0.4); }
        .curso-item { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .curso-item:last-child { border-bottom:none; }
        .btn-acao { padding:8px 18px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .btn-acao:hover { opacity:0.85; transform:translateY(-1px); }
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.push(`/${user?.perfil}`)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Dashboard
            </button>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color:'white', fontWeight:600, fontSize:14 }}>Trilhas de Aprendizagem</span>
          </div>
          <button onClick={logout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px' }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Trilhas de Aprendizagem</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:14 }}>Sequências de cursos organizadas por cargo, setor ou objetivo</p>
        </div>

        {buscando && (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        )}

        {!buscando && trilhas.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(255,255,255,0.3)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{margin:'0 auto 16px', display:'block', opacity:0.3}}><path d="M3 3h18M3 9h18M3 15h18M3 21h18"/></svg>
            <p style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Nenhuma trilha cadastrada</p>
            <p style={{ fontSize:13 }}>As trilhas serão criadas pelo administrador</p>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {trilhas.map(trilha => {
            const aberta = expandida === trilha.id
            const ch = chTotal(trilha)
            return (
              <div key={trilha.id} className="trilha-card">
                {/* HEADER DA TRILHA */}
                <div style={{ padding:'24px 28px', cursor:'pointer', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }} onClick={() => setExpandida(aberta ? null : trilha.id)}>
                  <div style={{ display:'flex', gap:18, alignItems:'flex-start', flex:1 }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M3 3h18M3 9h18M3 15h18M3 21h18"/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontSize:17, fontWeight:700, margin:'0 0 6px' }}>{trilha.titulo}</h3>
                      {trilha.descricao && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, margin:'0 0 12px', lineHeight:1.5 }}>{trilha.descricao}</p>}
                      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                        <span style={{ background:'rgba(139,92,246,0.15)', color:'#c4b5fd', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{trilha.total_cursos} curso{trilha.total_cursos !== 1 ? 's' : ''}</span>
                        <span style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{ch}h no total</span>
                        {trilha.prazo_dias > 0 && <span style={{ background:'rgba(245,158,11,0.12)', color:'#fcd34d', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{trilha.prazo_dias} dias</span>}
                        {trilha.publico_alvo && <span style={{ background:'rgba(16,185,129,0.12)', color:'#6ee7b7', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{trilha.publico_alvo}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.3)', transition:'transform 0.2s', transform: aberta ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* CURSOS DA TRILHA */}
                {aberta && (
                  <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'0 28px 20px' }}>
                    <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', margin:'16px 0 12px' }}>Cursos nesta trilha</p>
                    {(trilha.cursos || []).filter(Boolean).map((curso, idx) => (
                      <div key={curso.id} className="curso-item">
                        <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#a78bfa', flexShrink:0 }}>{idx+1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:500, color:'rgba(255,255,255,0.85)' }}>{curso.titulo}</div>
                          <div style={{ display:'flex', gap:8, marginTop:4 }}>
                            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>{curso.carga_horaria}h</span>
                            <span style={{ color:COR_NIVEL[curso.nivel] || '#6366f1', fontSize:12 }}>{curso.nivel}</span>
                            {curso.obrigatorio && <span style={{ color:'#fca5a5', fontSize:12 }}>Obrigatório</span>}
                          </div>
                        </div>
                        <button className="btn-acao" style={{ background:'rgba(99,102,241,0.15)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}
                          onClick={() => router.push(`/cursos/${curso.id}`)}>Iniciar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
