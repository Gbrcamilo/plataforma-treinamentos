'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Aula {
  id: string
  titulo: string
  tipo: 'video' | 'texto' | 'quiz' | 'scorm'
  duracao_minutos: number
  ordem: number
}

interface Curso {
  id: string
  titulo: string
  descricao: string
  categoria: string
  carga_horaria: number
  nivel: string
  obrigatorio: boolean
  aulas: Aula[]
}

export default function CursoDetalhe() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [curso, setCurso] = useState<Curso | null>(null)
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [progresso, setProgresso] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) return
    fetch(`/api/cursos/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setCurso(d.curso)
        if (d.curso?.aulas?.length) setAulaAtiva(d.curso.aulas[0])
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
  }, [user, id])

  const marcarConcluida = (aulaId: string) => {
    setProgresso(prev => ({ ...prev, [aulaId]: true }))
  }

  const totalAulas = curso?.aulas?.length || 0
  const aulasConcluidas = Object.values(progresso).filter(Boolean).length
  const percentual = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0

  if (loading || carregando) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!curso) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'white', gap:16 }}>
      <p>Curso não encontrado.</p>
      <button onClick={() => router.push('/cursos')} style={{ background:'#6366f1', border:'none', color:'white', padding:'10px 20px', borderRadius:8, cursor:'pointer' }}>Ver cursos</button>
    </div>
  )

  const iconeAula = (tipo: string) => {
    if (tipo === 'video') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    if (tipo === 'quiz') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white', display:'flex', flexDirection:'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .aula-item { padding:12px 16px; border-radius:10px; cursor:pointer; transition:background 0.15s; display:flex; align-items:center; gap:12px; border:1px solid transparent; }
        .aula-item:hover { background:rgba(255,255,255,0.05); }
        .aula-item.ativa { background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.3); }
        .btn-nav { padding:10px 20px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .btn-nav:hover { opacity:0.85; transform:translateY(-1px); }
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 24px', flexShrink:0 }}>
        <div style={{ height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => router.push('/cursos')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Cursos
            </button>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ fontSize:13, fontWeight:600, color:'white', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{curso.titulo}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:13, color:'#6366f1', fontWeight:600 }}>{percentual}% concluído</span>
            <button onClick={logout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', borderRadius:8, padding:'5px 10px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Sair</button>
          </div>
        </div>
        {/* BARRA DE PROGRESSO */}
        <div style={{ height:3, background:'rgba(255,255,255,0.05)', marginBottom:0 }}>
          <div style={{ height:'100%', width:`${percentual}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', transition:'width 0.5s' }} />
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', minHeight:0 }}>

        {/* SIDEBAR AULAS */}
        <div style={{ width:320, flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'20px 20px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize:15, fontWeight:700, margin:'0 0 4px', lineHeight:1.4 }}>{curso.titulo}</h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, margin:'0 0 10px' }}>{curso.carga_horaria}h · {totalAulas} aulas</p>
            <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
              <div style={{ height:'100%', width:`${percentual}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:2, transition:'width 0.5s' }} />
            </div>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, margin:'6px 0 0' }}>{aulasConcluidas}/{totalAulas} aulas concluídas</p>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'12px 12px' }}>
            {(curso.aulas || []).map((aula, idx) => (
              <div key={aula.id} className={`aula-item ${aulaAtiva?.id === aula.id ? 'ativa' : ''}`} onClick={() => setAulaAtiva(aula)}>
                <div style={{ width:28, height:28, borderRadius:'50%', background: progresso[aula.id] ? '#10b981' : 'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {progresso[aula.id]
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{idx + 1}</span>
                  }
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color: aulaAtiva?.id === aula.id ? 'white' : 'rgba(255,255,255,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{aula.titulo}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                    <span style={{ color:'rgba(255,255,255,0.3)', display:'flex' }}>{iconeAula(aula.tipo)}</span>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{aula.duracao_minutos}min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {aulaAtiva ? (
            <>
              {/* PLAYER / CONTEÚDO */}
              <div style={{ flex:1, overflow:'auto', padding:'32px 40px' }}>
                <div style={{ animation:'fadeIn 0.3s ease', maxWidth:860 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a5b4fc' }}>
                      {iconeAula(aulaAtiva.tipo)}
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase' }}>{aulaAtiva.tipo}</div>
                      <h2 style={{ fontSize:22, fontWeight:800, margin:0, letterSpacing:'-0.01em' }}>{aulaAtiva.titulo}</h2>
                    </div>
                  </div>

                  {/* PLAYER DE VÍDEO */}
                  {aulaAtiva.tipo === 'video' && (
                    <div style={{ background:'rgba(0,0,0,0.5)', borderRadius:16, overflow:'hidden', marginBottom:24, border:'1px solid rgba(255,255,255,0.08)', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(99,102,241,0.2)', border:'2px solid rgba(99,102,241,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', cursor:'pointer', transition:'all 0.2s' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="#6366f1" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:0 }}>Vídeo da aula · {aulaAtiva.duracao_minutos} minutos</p>
                        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12, margin:'8px 0 0' }}>Conecte o URL do vídeo no campo <code style={{color:'#a5b4fc'}}>url_video</code> da tabela <code style={{color:'#a5b4fc'}}>aulas</code></p>
                      </div>
                    </div>
                  )}

                  {/* CONTEÚDO TEXTO */}
                  {aulaAtiva.tipo === 'texto' && (
                    <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'28px 32px', border:'1px solid rgba(255,255,255,0.08)', marginBottom:24, lineHeight:1.8, color:'rgba(255,255,255,0.75)', fontSize:15 }}>
                      <p>Conteúdo textual da aula <strong style={{color:'white'}}>{aulaAtiva.titulo}</strong>.</p>
                      <p>O conteúdo completo será carregado do banco de dados através do campo <code style={{background:'rgba(99,102,241,0.15)', color:'#a5b4fc', padding:'2px 6px', borderRadius:4}}>conteudo_html</code> da tabela <code style={{background:'rgba(99,102,241,0.15)', color:'#a5b4fc', padding:'2px 6px', borderRadius:4}}>aulas</code>.</p>
                    </div>
                  )}

                  {/* QUIZ */}
                  {aulaAtiva.tipo === 'quiz' && (
                    <div style={{ background:'rgba(139,92,246,0.06)', borderRadius:12, padding:'28px 32px', border:'1px solid rgba(139,92,246,0.2)', marginBottom:24 }}>
                      <h3 style={{ fontSize:17, fontWeight:700, margin:'0 0 16px', color:'#c4b5fd' }}>Avaliação</h3>
                      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, margin:0 }}>As questões serão carregadas da tabela <code style={{color:'#c4b5fd'}}>questoes</code> vinculadas a esta aula. O sistema de quiz com pontuação e tentativas já está configurado no banco.</p>
                    </div>
                  )}

                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'16px 20px', border:'1px solid rgba(255,255,255,0.06)', marginBottom:24, color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:1.7 }}>
                    Duração estimada: <strong style={{color:'white'}}>{aulaAtiva.duracao_minutos} minutos</strong>
                  </div>
                </div>
              </div>

              {/* BARRA INFERIOR DE NAVEGAÇÃO */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                <button
                  className="btn-nav"
                  style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }}
                  disabled={!curso.aulas || curso.aulas.indexOf(aulaAtiva) === 0}
                  onClick={() => {
                    const idx = curso.aulas.indexOf(aulaAtiva)
                    if (idx > 0) setAulaAtiva(curso.aulas[idx - 1])
                  }}
                >← Anterior</button>

                <button
                  className="btn-nav"
                  style={{ background: progresso[aulaAtiva.id] ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: progresso[aulaAtiva.id] ? '#10b981' : 'white', border: progresso[aulaAtiva.id] ? '1px solid rgba(16,185,129,0.4)' : 'none' }}
                  onClick={() => marcarConcluida(aulaAtiva.id)}
                >
                  {progresso[aulaAtiva.id] ? '✓ Concluída' : 'Marcar como concluída'}
                </button>

                <button
                  className="btn-nav"
                  style={{ background:'rgba(99,102,241,0.15)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}
                  disabled={!curso.aulas || curso.aulas.indexOf(aulaAtiva) === curso.aulas.length - 1}
                  onClick={() => {
                    const idx = curso.aulas.indexOf(aulaAtiva)
                    if (idx < curso.aulas.length - 1) setAulaAtiva(curso.aulas[idx + 1])
                  }}
                >Próxima →</button>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)' }}>
              Selecione uma aula para começar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
