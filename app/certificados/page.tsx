'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Certificado {
  id: string
  curso_titulo: string
  carga_horaria: number
  categoria: string
  usuario_nome: string
  cargo: string
  area: string
  concluido_em: string
  codigo: string
}

export default function CertificadosPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [buscando, setBuscando] = useState(true)
  const [imprimindo, setImprimindo] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    fetch('/api/certificados', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setCertificados(d.certificados || []); setBuscando(false) })
      .catch(() => setBuscando(false))
  }, [user])

  const gerarCertificado = (cert: Certificado) => {
    setImprimindo(cert.id)
    const dataFmt = new Date(cert.concluido_em).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Certificado — ${cert.curso_titulo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
  .cert { width:900px; min-height:620px; background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%); border-radius:16px; padding:60px 72px; position:relative; overflow:hidden; color:white; }
  .cert::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:radial-gradient(ellipse at top right,rgba(99,102,241,0.15) 0%,transparent 60%),radial-gradient(ellipse at bottom left,rgba(16,185,129,0.1) 0%,transparent 60%); pointer-events:none; }
  .border-deco { position:absolute; inset:16px; border:1px solid rgba(255,255,255,0.08); border-radius:10px; pointer-events:none; }
  .corner { position:absolute; width:32px; height:32px; }
  .corner svg { width:100%; height:100%; }
  .corner.tl { top:24px; left:24px; }
  .corner.tr { top:24px; right:24px; transform:scaleX(-1); }
  .corner.bl { bottom:24px; left:24px; transform:scaleY(-1); }
  .corner.br { bottom:24px; right:24px; transform:scale(-1); }
  .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; position:relative; }
  .logo-text { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:rgba(255,255,255,0.9); letter-spacing:0.05em; }
  .logo-sub { font-size:11px; color:rgba(255,255,255,0.4); letter-spacing:0.15em; text-transform:uppercase; margin-top:2px; }
  .badge { background:rgba(99,102,241,0.2); border:1px solid rgba(99,102,241,0.4); border-radius:20px; padding:6px 16px; font-size:11px; font-weight:600; color:#a5b4fc; letter-spacing:0.08em; text-transform:uppercase; }
  .body { position:relative; text-align:center; }
  .declara { font-family:'Cormorant Garamond',serif; font-size:16px; font-style:italic; color:rgba(255,255,255,0.5); letter-spacing:0.05em; margin-bottom:20px; }
  .nome { font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:700; color:white; line-height:1.1; margin-bottom:12px; }
  .cargo-area { font-size:13px; color:rgba(255,255,255,0.45); letter-spacing:0.05em; margin-bottom:32px; }
  .concluiu { font-size:15px; color:rgba(255,255,255,0.6); margin-bottom:14px; }
  .curso { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; color:#c7d2fe; line-height:1.3; margin-bottom:8px; }
  .ch { font-size:13px; color:rgba(255,255,255,0.35); letter-spacing:0.05em; margin-bottom:40px; }
  .divider { width:80px; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); margin:0 auto 40px; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; position:relative; }
  .assinatura { text-align:center; }
  .linha-ass { width:160px; height:1px; background:rgba(255,255,255,0.2); margin:0 auto 6px; }
  .ass-nome { font-size:13px; font-weight:600; color:rgba(255,255,255,0.7); }
  .ass-cargo { font-size:11px; color:rgba(255,255,255,0.35); }
  .codigo { text-align:right; }
  .cod-label { font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px; }
  .cod-valor { font-size:13px; font-family:'Inter',monospace; color:rgba(255,255,255,0.5); letter-spacing:0.1em; }
  .data { font-size:12px; color:rgba(255,255,255,0.3); margin-top:4px; }
  @media print { body{padding:0} .cert{border-radius:0; width:100%; min-height:100vh} }
</style></head><body>
<div class="cert">
  <div class="border-deco"></div>
  <div class="corner tl"><svg viewBox="0 0 32 32" fill="none"><path d="M2 16 L2 2 L16 2" stroke="rgba(99,102,241,0.5)" stroke-width="1.5"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 32 32" fill="none"><path d="M2 16 L2 2 L16 2" stroke="rgba(99,102,241,0.5)" stroke-width="1.5"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 32 32" fill="none"><path d="M2 16 L2 2 L16 2" stroke="rgba(99,102,241,0.5)" stroke-width="1.5"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 32 32" fill="none"><path d="M2 16 L2 2 L16 2" stroke="rgba(99,102,241,0.5)" stroke-width="1.5"/></svg></div>
  <div class="header">
    <div><div class="logo-text">HDS</div><div class="logo-sub">Hospital Training System</div></div>
    <div class="badge">Certificado de Conclusão</div>
  </div>
  <div class="body">
    <div class="declara">Certificamos que</div>
    <div class="nome">${cert.usuario_nome}</div>
    <div class="cargo-area">${cert.cargo || ''} ${cert.area ? '&middot; ' + cert.area : ''}</div>
    <div class="concluiu">concluiu com êxito o curso</div>
    <div class="curso">${cert.curso_titulo}</div>
    <div class="ch">Carga horária: ${cert.carga_horaria}h &middot; ${cert.categoria}</div>
    <div class="divider"></div>
    <div class="footer">
      <div class="assinatura">
        <div class="linha-ass"></div>
        <div class="ass-nome">Coordenação Educacional</div>
        <div class="ass-cargo">HDS &mdash; Treinamentos</div>
      </div>
      <div class="codigo">
        <div class="cod-label">Código do certificado</div>
        <div class="cod-valor">${cert.codigo}</div>
        <div class="data">Emitido em ${dataFmt}</div>
      </div>
    </div>
  </div>
</div>
</body></html>`

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      setTimeout(() => { win.print(); setImprimindo(null) }, 600)
    } else {
      setImprimindo(null)
    }
  }

  if (loading) return <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>Carregando...</div>

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', fontFamily:"'Inter',-apple-system,sans-serif", color:'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .cert-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; animation:fadeUp 0.4s ease; }
        .btn-download { padding:10px 20px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; transition:opacity 0.15s,transform 0.15s; display:flex; align-items:center; gap:8px; }
        .btn-download:hover { opacity:0.9; transform:translateY(-1px); }
        .btn-download:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.push(`/${user?.perfil}`)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Dashboard
            </button>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color:'white', fontWeight:600, fontSize:14 }}>Certificados</span>
          </div>
          <button onClick={logout} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px' }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Meus Certificados</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:14 }}>{certificados.length} certificado{certificados.length !== 1 ? 's' : ''} emitido{certificados.length !== 1 ? 's' : ''}</p>
        </div>

        {buscando && (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        )}

        {!buscando && certificados.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(255,255,255,0.3)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{margin:'0 auto 16px', display:'block', opacity:0.3}}>
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <p style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Nenhum certificado ainda</p>
            <p style={{ fontSize:13 }}>Conclua um curso para receber seu certificado</p>
            <button onClick={() => router.push('/cursos')} style={{ marginTop:24, background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)', color:'#a5b4fc', borderRadius:8, padding:'10px 20px', cursor:'pointer', fontSize:13, fontWeight:600 }}>Ver cursos disponíveis</button>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
          {certificados.map(cert => (
            <div key={cert.id} className="cert-card">
              {/* BANNER */}
              <div style={{ height:90, background:'linear-gradient(135deg,#1e1b4b,#0f172a)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,rgba(99,102,241,0.15),transparent 70%)' }} />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" style={{position:'relative'}}>
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              {/* INFO */}
              <div style={{ padding:'20px 24px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ background:'rgba(99,102,241,0.15)', color:'#a5b4fc', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{cert.categoria}</span>
                  <span style={{ background:'rgba(16,185,129,0.15)', color:'#6ee7b7', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>Concluído</span>
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, margin:'0 0 6px', lineHeight:1.4 }}>{cert.curso_titulo}</h3>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'0 0 12px' }}>
                  {cert.carga_horaria}h &middot; Emitido em {new Date(cert.concluido_em).toLocaleDateString('pt-BR')}
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', letterSpacing:'0.05em' }}>{cert.codigo}</span>
                  <button className="btn-download" disabled={imprimindo === cert.id} onClick={() => gerarCertificado(cert)}>
                    {imprimindo === cert.id
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin 0.8s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    }
                    {imprimindo === cert.id ? 'Gerando...' : 'Baixar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
