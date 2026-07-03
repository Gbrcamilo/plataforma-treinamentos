'use client'
import { useState } from 'react'

const equipe = [
  { nome: 'Ana Paula Souza', cargo: 'Enfermeira', concluidos: 8, emAndamento: 2, pendentes: 1, status: 'em_dia' },
  { nome: 'Carlos Mendes', cargo: 'Técnico de TI', concluidos: 5, emAndamento: 1, pendentes: 3, status: 'atencao' },
  { nome: 'Fernanda Lima', cargo: 'Farmacêutica', concluidos: 10, emAndamento: 0, pendentes: 0, status: 'em_dia' },
  { nome: 'Roberto Costa', cargo: 'Administrativo', concluidos: 3, emAndamento: 3, pendentes: 4, status: 'critico' },
  { nome: 'Juliana Ferreira', cargo: 'Recepcionista', concluidos: 7, emAndamento: 1, pendentes: 1, status: 'em_dia' },
  { nome: 'Marcos Oliveira', cargo: 'Segurança', concluidos: 4, emAndamento: 2, pendentes: 2, status: 'atencao' },
]

const trilhas = [
  { nome: 'Segurança do Paciente', obrigatorio: true, concluidos: 5, total: 6, prazo: '15/07/2026' },
  { nome: 'Boas Práticas Clínicas', obrigatorio: true, concluidos: 4, total: 6, prazo: '30/07/2026' },
  { nome: 'LGPD na Saúde', obrigatorio: true, concluidos: 6, total: 6, prazo: '10/08/2026' },
  { nome: 'Liderança e Gestão', obrigatorio: false, concluidos: 2, total: 4, prazo: '31/08/2026' },
]

const alertas = [
  { tipo: 'urgente', msg: 'Roberto Costa: 4 treinamentos obrigatórios vencidos', icon: '⚠' },
  { tipo: 'atencao', msg: 'Carlos Mendes: prazo se esgota em 3 dias para LGPD', icon: '⏰' },
  { tipo: 'info', msg: 'Trilha Segurança do Paciente: 83% concluída pela equipe', icon: 'ℹ' },
]

const menus = ['Dashboard','Minha Equipe','Trilhas','Relatórios','Certificados','Alertas']

export default function GestorPage() {
  const [aba, setAba] = useState('Dashboard')
  const [busca, setBusca] = useState('')

  const filtrado = equipe.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    e.cargo.toLowerCase().includes(busca.toLowerCase())
  )

  const statusBadge = (s: string) => {
    if (s === 'em_dia') return <span style={{background:'#d1fae5',color:'#065f46',padding:'2px 10px',borderRadius:9999,fontSize:12,fontWeight:600}}>Em dia</span>
    if (s === 'atencao') return <span style={{background:'#fef9c3',color:'#854d0e',padding:'2px 10px',borderRadius:9999,fontSize:12,fontWeight:600}}>Atenção</span>
    return <span style={{background:'#fee2e2',color:'#991b1b',padding:'2px 10px',borderRadius:9999,fontSize:12,fontWeight:600}}>Crítico</span>
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:'Inter,sans-serif',background:'#f8fafc'}}>
      {/* SIDEBAR */}
      <aside style={{width:240,background:'#1e293b',display:'flex',flexDirection:'column',padding:'0 0 24px 0',position:'fixed',top:0,left:0,bottom:0,zIndex:50}}>
        <div style={{padding:'28px 24px 20px',borderBottom:'1px solid #334155'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div style={{color:'white',fontWeight:700,fontSize:14}}>Portal Gestor</div>
              <div style={{color:'#94a3b8',fontSize:11}}>Treinamentos</div>
            </div>
          </div>
        </div>
        <div style={{padding:'8px 12px',flex:1}}>
          {menus.map(m => (
            <button key={m} onClick={() => setAba(m)}
              style={{width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:8,border:'none',cursor:'pointer',marginBottom:2,
                background: aba===m ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: aba===m ? '#a5b4fc' : '#94a3b8',
                fontWeight: aba===m ? 600 : 400, fontSize:14,
                borderLeft: aba===m ? '3px solid #6366f1' : '3px solid transparent',
                transition:'all 0.15s'}}>
              {m}
            </button>
          ))}
        </div>
        <div style={{padding:'16px 24px',borderTop:'1px solid #334155'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13}}>MG</div>
            <div>
              <div style={{color:'white',fontSize:13,fontWeight:600}}>Maria Gestora</div>
              <div style={{color:'#64748b',fontSize:11}}>UTI Central</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{marginLeft:240,flex:1,padding:'32px'}}>
        {/* ALERTAS */}
        {alertas.filter(a=>a.tipo==='urgente').length > 0 && (
          <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'12px 16px',marginBottom:24,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:18}}>⚠️</span>
            <span style={{color:'#991b1b',fontSize:13,fontWeight:500}}>{alertas.find(a=>a.tipo==='urgente')?.msg}</span>
          </div>
        )}

        {aba === 'Dashboard' && (
          <>
            <div style={{marginBottom:28}}>
              <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',margin:0}}>Painel do Gestor</h1>
              <p style={{color:'#64748b',fontSize:14,marginTop:4}}>Visão geral da equipe — UTI Central</p>
            </div>

            {/* KPIs */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
              {[
                { label:'Colaboradores', val:'6', sub:'na equipe', cor:'#6366f1' },
                { label:'Conformidade', val:'72%', sub:'média geral', cor:'#10b981' },
                { label:'Vencidos', val:'3', sub:'treinamentos', cor:'#ef4444' },
                { label:'Certificados', val:'24', sub:'emitidos', cor:'#f59e0b' },
              ].map(k => (
                <div key={k.label} style={{background:'white',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${k.cor}`}}>
                  <div style={{fontSize:28,fontWeight:800,color:k.cor}}>{k.val}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'#1e293b',marginTop:2}}>{k.label}</div>
                  <div style={{fontSize:12,color:'#94a3b8'}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* TRILHAS + ALERTAS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20,marginBottom:28}}>
              <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <h2 style={{fontSize:15,fontWeight:700,color:'#1e293b',marginBottom:16}}>Progresso das Trilhas</h2>
                {trilhas.map(t => {
                  const pct = Math.round((t.concluidos/t.total)*100)
                  return (
                    <div key={t.nome} style={{marginBottom:16}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <div>
                          <span style={{fontSize:13,fontWeight:600,color:'#1e293b'}}>{t.nome}</span>
                          {t.obrigatorio && <span style={{marginLeft:8,background:'#fee2e2',color:'#991b1b',fontSize:10,padding:'1px 6px',borderRadius:4,fontWeight:600}}>OBRIGATÓRIO</span>}
                        </div>
                        <span style={{fontSize:12,color:'#64748b'}}>Prazo: {t.prazo}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{flex:1,background:'#f1f5f9',borderRadius:99,height:8}}>
                          <div style={{width:`${pct}%`,background: pct===100 ? '#10b981' : pct>=60 ? '#6366f1' : '#ef4444',borderRadius:99,height:8,transition:'width 0.5s'}} />
                        </div>
                        <span style={{fontSize:12,fontWeight:700,color:'#1e293b',minWidth:40}}>{pct}%</span>
                        <span style={{fontSize:11,color:'#94a3b8'}}>{t.concluidos}/{t.total}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <h2 style={{fontSize:15,fontWeight:700,color:'#1e293b',marginBottom:16}}>Alertas da Equipe</h2>
                {alertas.map((a,i) => (
                  <div key={i} style={{padding:'10px 12px',borderRadius:8,marginBottom:10,
                    background: a.tipo==='urgente' ? '#fef2f2' : a.tipo==='atencao' ? '#fefce8' : '#f0f9ff',
                    border: `1px solid ${a.tipo==='urgente'?'#fecaca':a.tipo==='atencao'?'#fef08a':'#bae6fd'}`}}>
                    <div style={{fontSize:13,color: a.tipo==='urgente'?'#991b1b':a.tipo==='atencao'?'#854d0e':'#0c4a6e'}}>{a.msg}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TABELA RESUMO EQUIPE */}
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h2 style={{fontSize:15,fontWeight:700,color:'#1e293b',margin:0}}>Resumo da Equipe</h2>
                <button onClick={()=>setAba('Minha Equipe')} style={{background:'#6366f1',color:'white',border:'none',borderRadius:8,padding:'7px 16px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Ver todos</button>
              </div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid #f1f5f9'}}>
                    {['Colaborador','Cargo','Concluídos','Em andamento','Status'].map(h => (
                      <th key={h} style={{textAlign:'left',padding:'8px 12px',fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {equipe.slice(0,4).map(e => (
                    <tr key={e.nome} style={{borderBottom:'1px solid #f8fafc'}}>
                      <td style={{padding:'12px 12px',fontSize:14,fontWeight:600,color:'#1e293b'}}>{e.nome}</td>
                      <td style={{padding:'12px 12px',fontSize:13,color:'#64748b'}}>{e.cargo}</td>
                      <td style={{padding:'12px 12px',fontSize:14,fontWeight:700,color:'#10b981'}}>{e.concluidos}</td>
                      <td style={{padding:'12px 12px',fontSize:14,color:'#6366f1',fontWeight:600}}>{e.emAndamento}</td>
                      <td style={{padding:'12px 12px'}}>{statusBadge(e.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {aba === 'Minha Equipe' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <div>
                <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',margin:0}}>Minha Equipe</h1>
                <p style={{color:'#64748b',fontSize:14,marginTop:4}}>UTI Central — {equipe.length} colaboradores</p>
              </div>
              <input value={busca} onChange={e=>setBusca(e.target.value)}
                placeholder="Buscar colaborador..."
                style={{padding:'9px 14px',borderRadius:8,border:'1px solid #e2e8f0',fontSize:14,width:240,outline:'none'}} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
              {filtrado.map(e => {
                const total = e.concluidos + e.emAndamento + e.pendentes
                const pct = total > 0 ? Math.round((e.concluidos/total)*100) : 0
                return (
                  <div key={e.nome} style={{background:'white',borderRadius:12,padding:20,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14}}>
                          {e.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}
                        </div>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:'#1e293b'}}>{e.nome}</div>
                          <div style={{fontSize:12,color:'#64748b'}}>{e.cargo}</div>
                        </div>
                      </div>
                      {statusBadge(e.status)}
                    </div>
                    <div style={{display:'flex',gap:12,marginBottom:14}}>
                      {[
                        {l:'Concluídos',v:e.concluidos,c:'#10b981'},
                        {l:'Andamento',v:e.emAndamento,c:'#6366f1'},
                        {l:'Pendentes',v:e.pendentes,c:'#ef4444'},
                      ].map(x => (
                        <div key={x.l} style={{flex:1,textAlign:'center',background:'#f8fafc',borderRadius:8,padding:'8px 4px'}}>
                          <div style={{fontSize:20,fontWeight:800,color:x.c}}>{x.v}</div>
                          <div style={{fontSize:10,color:'#94a3b8',fontWeight:600}}>{x.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:12,color:'#64748b'}}>Progresso geral</span>
                        <span style={{fontSize:12,fontWeight:700,color:'#1e293b'}}>{pct}%</span>
                      </div>
                      <div style={{background:'#f1f5f9',borderRadius:99,height:6}}>
                        <div style={{width:`${pct}%`,background: pct>=70?'#10b981':pct>=40?'#6366f1':'#ef4444',borderRadius:99,height:6}} />
                      </div>
                    </div>
                    <button style={{width:'100%',background:'transparent',border:'1px solid #e2e8f0',borderRadius:8,padding:'7px',fontSize:13,color:'#6366f1',fontWeight:600,cursor:'pointer',marginTop:4}}>Ver detalhes</button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {aba === 'Relatórios' && (
          <>
            <h1 style={{fontSize:22,fontWeight:700,color:'#1e293b',marginBottom:8}}>Relatórios</h1>
            <p style={{color:'#64748b',fontSize:14,marginBottom:24}}>Exporte relatórios da sua equipe</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {[
                {titulo:'Conformidade Geral',desc:'% de conclusão por colaborador e trilha',cor:'#6366f1'},
                {titulo:'Treinamentos Vencidos',desc:'Lista de pendências e prazos expirados',cor:'#ef4444'},
                {titulo:'Certificados Emitidos',desc:'Todos os certificados da equipe',cor:'#10b981'},
                {titulo:'Progresso por Trilha',desc:'Status de cada trilha na equipe',cor:'#f59e0b'},
                {titulo:'Histórico de Acesso',desc:'Logs de acesso e atividade',cor:'#8b5cf6'},
                {titulo:'Desempenho em Avaliações',desc:'Notas e tentativas por colaborador',cor:'#0ea5e9'},
              ].map(r => (
                <div key={r.titulo} style={{background:'white',borderRadius:12,padding:20,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${r.cor}`}}>
                  <h3 style={{fontSize:14,fontWeight:700,color:'#1e293b',marginBottom:6}}>{r.titulo}</h3>
                  <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>{r.desc}</p>
                  <div style={{display:'flex',gap:8}}>
                    <button style={{flex:1,background:r.cor,color:'white',border:'none',borderRadius:7,padding:'8px',fontSize:12,fontWeight:600,cursor:'pointer'}}>PDF</button>
                    <button style={{flex:1,background:'#f1f5f9',color:'#1e293b',border:'none',borderRadius:7,padding:'8px',fontSize:12,fontWeight:600,cursor:'pointer'}}>CSV</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!['Dashboard','Minha Equipe','Relatórios'].includes(aba) && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400}}>
            <div style={{fontSize:48,marginBottom:16}}>🔧</div>
            <h2 style={{color:'#1e293b',fontWeight:700,marginBottom:8}}>{aba}</h2>
            <p style={{color:'#64748b',fontSize:14}}>Esta seção está sendo implementada.</p>
          </div>
        )}
      </main>
    </div>
  )
}
