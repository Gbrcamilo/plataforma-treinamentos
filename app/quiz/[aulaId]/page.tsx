'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Alternativa { id: string; texto: string }
interface Questao { id: string; enunciado: string; tipo: string; pontos: number; alternativas: Alternativa[] }
interface Resultado { nota: number; acertos: number; total: number; aprovado: boolean; detalhes: { questao_id: string; acertou: boolean; correta: string; respondida: string }[] }

export default function QuizPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const aulaId = params.aulaId as string

  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [atual, setAtual] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`/api/quiz/${aulaId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setQuestoes(d.questoes || []); setCarregando(false) })
      .catch(() => setCarregando(false))
  }, [user, aulaId])

  const responder = (questaoId: string, altId: string) => {
    setRespostas(prev => ({ ...prev, [questaoId]: altId }))
  }

  const enviar = async () => {
    setEnviando(true)
    const res = await fetch(`/api/quiz/${aulaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ respostas }),
    })
    const data = await res.json()
    setResultado(data)
    setEnviando(false)
  }

  if (loading || carregando) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const q = questoes[atual]
  const total = questoes.length
  const respondidas = Object.keys(respostas).length
  const pct = total > 0 ? Math.round((respondidas / total) * 100) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white', display:'flex', flexDirection:'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        .alt-btn { width:100%; padding:16px 20px; border-radius:12px; border:1.5px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.8); font-size:14px; font-weight:500; cursor:pointer; transition:all 0.15s; text-align:left; display:flex; align-items:center; gap:14px; }
        .alt-btn:hover:not(:disabled) { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); }
        .alt-btn.selected { background:rgba(99,102,241,0.15); border-color:#6366f1; color:white; }
        .alt-btn.correta { background:rgba(16,185,129,0.15); border-color:#10b981; color:#6ee7b7; }
        .alt-btn.errada { background:rgba(239,68,68,0.1); border-color:#ef4444; color:#fca5a5; }
        .btn-nav { padding:12px 28px; border-radius:10px; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .btn-nav:hover { opacity:0.85; transform:translateY(-1px); }
        .btn-nav:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 24px', flexShrink:0 }}>
        <div style={{ height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:15, fontWeight:700 }}>Avaliação</span>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{respondidas}/{total} respondidas</span>
        </div>
        <div style={{ height:3, background:'rgba(255,255,255,0.05)' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', transition:'width 0.3s' }} />
        </div>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>

        {/* RESULTADO */}
        {resultado ? (
          <div style={{ maxWidth:480, width:'100%', textAlign:'center', animation:'pop 0.5s ease' }}>
            <div style={{ width:100, height:100, borderRadius:'50%', margin:'0 auto 24px', display:'flex', alignItems:'center', justifyContent:'center', background: resultado.aprovado ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', border:`2px solid ${resultado.aprovado ? '#10b981' : '#ef4444'}` }}>
              {resultado.aprovado
                ? <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
            </div>
            <h2 style={{ fontSize:28, fontWeight:800, margin:'0 0 8px' }}>{resultado.aprovado ? 'Parabéns!' : 'Quase lá'}</h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15, margin:'0 0 24px' }}>
              Você acertou <strong style={{color:'white'}}>{resultado.acertos} de {resultado.total}</strong> questões
            </p>
            <div style={{ fontSize:56, fontWeight:800, color: resultado.aprovado ? '#10b981' : '#f59e0b', margin:'0 0 8px' }}>{resultado.nota}%</div>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13, margin:'0 0 32px' }}>{resultado.aprovado ? 'Nota mínima atingida (60%)' : 'Nota mínima não atingida (60%)'}</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              {!resultado.aprovado && (
                <button className="btn-nav" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => { setResultado(null); setRespostas({}); setAtual(0) }}>Tentar novamente</button>
              )}
              <button className="btn-nav" style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white' }}
                onClick={() => router.back()}>Voltar ao curso</button>
            </div>
          </div>
        ) : (
          /* QUIZ */
          total === 0 ? (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)' }}>
              <p>Nenhuma questão cadastrada para esta avaliação.</p>
              <button className="btn-nav" style={{ marginTop:20, background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }} onClick={() => router.back()}>Voltar</button>
            </div>
          ) : (
            <div style={{ maxWidth:640, width:'100%', animation:'fadeIn 0.3s ease' }}>
              {/* NAVEGAÇÃO LATERAL */}
              <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap' }}>
                {questoes.map((q2, idx) => (
                  <button key={q2.id} onClick={() => setAtual(idx)} style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${atual === idx ? '#6366f1' : respostas[q2.id] ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'}`, background: atual === idx ? 'rgba(99,102,241,0.2)' : respostas[q2.id] ? 'rgba(16,185,129,0.1)' : 'transparent', color: atual === idx ? '#a5b4fc' : respostas[q2.id] ? '#6ee7b7' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:600, cursor:'pointer' }}>{idx+1}</button>
                ))}
              </div>

              {q && (
                <>
                  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'28px 32px', marginBottom:20 }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Questão {atual + 1} de {total}</div>
                    <p style={{ fontSize:17, fontWeight:600, lineHeight:1.6, color:'white' }}>{q.enunciado}</p>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                    {q.alternativas.map((alt, i) => (
                      <button key={alt.id} className={`alt-btn${respostas[q.id] === alt.id ? ' selected' : ''}`} onClick={() => responder(q.id, alt.id)}>
                        <span style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, color: respostas[q.id] === alt.id ? '#a5b4fc' : 'rgba(255,255,255,0.4)' }}>{String.fromCharCode(65+i)}</span>
                        {alt.texto}
                      </button>
                    ))}
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <button className="btn-nav" disabled={atual === 0} onClick={() => setAtual(a => a-1)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)' }}>← Anterior</button>
                    {atual < total - 1
                      ? <button className="btn-nav" disabled={!respostas[q.id]} onClick={() => setAtual(a => a+1)} style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white' }}>Próxima →</button>
                      : <button className="btn-nav" disabled={respondidas < total || enviando} onClick={enviar} style={{ background: respondidas === total ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.1)', color: respondidas === total ? 'white' : 'rgba(255,255,255,0.4)', border: respondidas < total ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                          {enviando ? 'Enviando...' : respondidas < total ? `Responda todas (${total - respondidas} faltando)` : 'Enviar avaliação'}
                        </button>
                    }
                  </div>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
