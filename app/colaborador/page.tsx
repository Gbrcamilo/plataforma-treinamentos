'use client'
import { useState } from 'react'

const menus = ['Início','Meus Cursos','Trilhas','Certificados','Avaliações','Notificações']

const cursos = [
  { nome:'Segurança do Paciente', categoria:'Obrigatório', progresso:100, concluido:true, nota:9.2, prazo:'Concluído', cor:'#10b981' },
  { nome:'LGPD na Saúde', categoria:'Obrigatório', progresso:68, concluido:false, nota:null, prazo:'10/07/2026', cor:'#6366f1' },
  { nome:'Prevenção de Infecções', categoria:'Obrigatório', progresso:0, concluido:false, nota:null, prazo:'20/07/2026', cor:'#ef4444' },
  { nome:'Comunicação Não Violenta', categoria:'Complementar', progresso:45, concluido:false, nota:null, prazo:'31/08/2026', cor:'#f59e0b' },
  { nome:'Excel para Saúde', categoria:'Complementar', progresso:100, concluido:true, nota:8.5, prazo:'Concluído', cor:'#10b981' },
]

const certificados = [
  { nome:'Segurança do Paciente', data:'12/06/2026', validade:'12/06/2027', id:'CERT-2026-001' },
  { nome:'Excel para Saúde', data:'05/05/2026', validade:'05/05/2027', id:'CERT-2026-002' },
]

const notificacoes = [
  { tipo:'urgente', msg:'LGPD na Saúde vence em 7 dias — complete agora!', hora:'Hoje' },
  { tipo:'info', msg:'Novo curso disponível: Gestão de Resíduos Hospitalares', hora:'Ontem' },
  { tipo:'sucesso', msg:'Certificado de Segurança do Paciente emitido com sucesso', hora:'12/06' },
]

export default function ColaboradorPage() {
  const [aba, setAba] = useState('Início')
  const [cursoAtivo, setCursoAtivo] = useState<number|null>(null)

  const concluidos = cursos.filter(c => c.concluido).length
  const progMediario = Math.round(cursos.reduce((acc,c)=>acc+c.progresso,0)/cursos.length)

  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:'Inter,sans-serif',background:'#f8fafc'}}>
      {/* SIDEBAR */}
      <aside style={{width:240,background:'#0f172a',display:'flex',flexDirection:'column',padding:'0 0 24px 0',position:'fixed',top:0,left:0,bottom:0,zIndex:50}}>
        <div style={{padding:'28px 24px 20px',borderBottom:'1px solid #1e293b'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style={{color:'white',fontWeight:700,fontSize:14}}>Meu Portal</div>
              <div style={{color:'#64748b',fontSize:11}}>Treinamentos</div>
            </div>
          </div>
        </div>
        <div style={{padding:'8px 12px',flex:1}}>
          {menus.map(m => (
            <button key={m} onClick={() => setAba(m)}
              style={{width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:8,border:'none',cursor:'pointer',marginBottom:2,
                background: aba===m ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: aba===m ? '#6ee7b7' : '#94a3b8',
                fontWeight: aba===m ? 600 : 400, fontSize:14,
                borderLeft: aba===m ? '3px solid #10b981' : '3px solid transparent',
                transition:'all 0.15s'}}>
              {m}
              {m==='Notificações' && <span style={{marginLeft:6,background:'#ef4444',color:'white',borderRadius:99,padding:'1px 6px',fontSize:10,fontWeight:700}}>1</span>}
            </button>
          ))}
        </div>
        <div style={{padding:'16px 24px',borderTop:'1px solid #1e293b'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13}}>JP</div>
            <div>
              <div style={{color:'white',fontSize:13,fontWeight:600}}>João Pereira</div>
              <div style={{color:'#475569',fontSize:11}}>Técnico de Enfermagem</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{marginLeft:240,flex:1,padding:'32px'}}>

        {/* BANNER URGENTE */}
        {notificacoes.some(n=>n.tipo==='urgente') && (
          <div style={{background:'linear-gradient(135deg,#fef2f2,#fff7ed)',border:'1px solid #fecaca',borderRadius:12,padding:'14px 20px',marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20}}>🔔</span>
              <span style={{color:'#991b1b',fontSize:13,fontWeight:600}}>{notificacoes.find(n=>n.tipo==='urgente')?.msg}</span>
            </div>
            <button onClick={()=>setAba('Meus Cursos')} style={{background:'#ef4444',color:'white',border:'none',borderRadius:8,padding:'6px 16px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Ver agora</button>
          </div>
        )}

        {aba === 'Início' && (
          <>
            <div style={{marginBottom:28}}>
              <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',margin:0}}>Olá, João! 👋</h1>
              <p style={{color:'#64748b',fontSize:14,marginTop:4}}>Aqui está o seu progresso de hoje</p>
            </div>

            {/* KPIs */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
              {[
                {label:'Concluídos',val:`${concluidos}/${cursos.length}`,sub:'cursos',cor:'#10b981'},
                {label:'Progresso Médio',val:`${progMediario}%`,sub:'nos ativos',cor:'#6366f1'},
                {label:'Certificados',val:certificados.length,sub:'emitidos',cor:'#f59e0b'},
                {label:'Prazo Próximo',val:'7 dias',sub:'LGPD na Saúde',cor:'#ef4444'},
              ].map(k => (
                <div key={k.label} style={{background:'white',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${k.cor}`}}>
                  <div style={{fontSize:26,fontWeight:800,color:k.cor}}>{k.val}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'#1e293b',marginTop:2}}>{k.label}</div>
                  <div style={{fontSize:12,color:'#94a3b8'}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* CURSOS EM DESTAQUE */}
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20,marginBottom:24}}>
              <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <h2 style={{fontSize:15,fontWeight:700,color:'#1e293b',margin:0}}>Continuar aprendendo</h2>
                  <button onClick={()=>setAba('Meus Cursos')} style={{background:'transparent',border:'none',color:'#6366f1',fontSize:13,fontWeight:600,cursor:'pointer'}}>Ver todos →</button>
                </div>
                {cursos.filter(c=>!c.concluido).slice(0,3).map((c,i) => (
                  <div key={i} style={{padding:'12px 0',borderBottom:'1px solid #f1f5f9'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:'#1e293b'}}>{c.nome}</div>
                        <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Prazo: {c.prazo} · {c.categoria}</div>
                      </div>
                      <button style={{background:'#6366f1',color:'white',border:'none',borderRadius:7,padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer'}}>Continuar</button>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,background:'#f1f5f9',borderRadius:99,height:6}}>
                        <div style={{width:`${c.progresso}%`,background:c.cor,borderRadius:99,height:6}} />
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:'#1e293b',minWidth:30}}>{c.progresso}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <h2 style={{fontSize:15,fontWeight:700,color:'#1e293b',marginBottom:16}}>Meus Certificados</h2>
                {certificados.map((cert,i) => (
                  <div key={i} style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,padding:'12px',marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#065f46',marginBottom:2}}>{cert.nome}</div>
                    <div style={{fontSize:11,color:'#6b7280'}}>Emitido: {cert.data}</div>
                    <div style={{fontSize:11,color:'#6b7280'}}>Válido até: {cert.validade}</div>
                    <button style={{marginTop:8,background:'#10b981',color:'white',border:'none',borderRadius:6,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer'}}>⬇ Baixar</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {aba === 'Meus Cursos' && (
          <>
            <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',marginBottom:8}}>Meus Cursos</h1>
            <p style={{color:'#64748b',fontSize:14,marginBottom:24}}>{cursos.length} cursos no total</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
              {cursos.map((c,i) => (
                <div key={i} style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',border:`1px solid #f1f5f9`}}>
                  <div style={{height:6,background:c.cor}} />
                  <div style={{padding:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                      <h3 style={{fontSize:14,fontWeight:700,color:'#1e293b',margin:0,flex:1}}>{c.nome}</h3>
                      <span style={{marginLeft:8,background: c.categoria==='Obrigatório'?'#fee2e2':'#f0f9ff',color:c.categoria==='Obrigatório'?'#991b1b':'#0c4a6e',padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,whiteSpace:'nowrap'}}>{c.categoria}</span>
                    </div>
                    <div style={{marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:12,color:'#64748b'}}>Progresso</span>
                        <span style={{fontSize:12,fontWeight:700,color:c.cor}}>{c.progresso}%</span>
                      </div>
                      <div style={{background:'#f1f5f9',borderRadius:99,height:8}}>
                        <div style={{width:`${c.progresso}%`,background:c.cor,borderRadius:99,height:8}} />
                      </div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:12,color:'#94a3b8'}}>Prazo: {c.prazo}</span>
                      {c.concluido
                        ? <button style={{background:'#f0fdf4',color:'#065f46',border:'1px solid #bbf7d0',borderRadius:7,padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer'}}>✓ Concluído</button>
                        : <button style={{background:'#6366f1',color:'white',border:'none',borderRadius:7,padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer'}}>Continuar</button>
                      }
                    </div>
                    {c.nota && (
                      <div style={{marginTop:10,padding:'6px 10px',background:'#fef9c3',borderRadius:6}}>
                        <span style={{fontSize:12,color:'#854d0e',fontWeight:600}}>Nota final: {c.nota}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {aba === 'Certificados' && (
          <>
            <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',marginBottom:8}}>Meus Certificados</h1>
            <p style={{color:'#64748b',fontSize:14,marginBottom:24}}>{certificados.length} certificados emitidos</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16}}>
              {certificados.map((c,i) => (
                <div key={i} style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',border:'2px solid #d1fae5'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                    </div>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:'#1e293b'}}>{c.nome}</div>
                      <div style={{fontSize:12,color:'#10b981',fontWeight:600'}}>Certificado válido</div>
                    </div>
                  </div>
                  <div style={{background:'#f8fafc',borderRadius:8,padding:'12px',marginBottom:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:12,color:'#64748b'}}>ID do Certificado</span>
                      <span style={{fontSize:12,fontWeight:700,color:'#1e293b'}}>{c.id}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:12,color:'#64748b'}}>Emitido em</span>
                      <span style={{fontSize:12,fontWeight:600,color:'#1e293b'}}>{c.data}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:12,color:'#64748b'}}>Válido até</span>
                      <span style={{fontSize:12,fontWeight:600,color:'#10b981'}}>{c.validade}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button style={{flex:1,background:'#10b981',color:'white',border:'none',borderRadius:8,padding:'9px',fontSize:13,fontWeight:600,cursor:'pointer'}}>⬇ Download PDF</button>
                    <button style={{background:'#f1f5f9',color:'#1e293b',border:'none',borderRadius:8,padding:'9px 14px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Compartilhar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {aba === 'Notificações' && (
          <>
            <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',marginBottom:24}}>Notificações</h1>
            <div style={{maxWidth:640}}>
              {notificacoes.map((n,i) => (
                <div key={i} style={{
                  background:'white',borderRadius:12,padding:'16px 20px',marginBottom:12,
                  boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
                  borderLeft:`4px solid ${n.tipo==='urgente'?'#ef4444':n.tipo==='sucesso'?'#10b981':'#6366f1'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:14,color:'#1e293b',fontWeight:500}}>{n.msg}</span>
                    <span style={{fontSize:11,color:'#94a3b8',marginLeft:16,whiteSpace:'nowrap'}}>{n.hora}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!['Início','Meus Cursos','Certificados','Notificações'].includes(aba) && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400}}>
            <div style={{fontSize:48,marginBottom:16}}>🚀</div>
            <h2 style={{color:'#1e293b',fontWeight:700,marginBottom:8}}>{aba}</h2>
            <p style={{color:'#64748b',fontSize:14}}>Esta seção será implementada em breve.</p>
          </div>
        )}
      </main>
    </div>
  )
}
