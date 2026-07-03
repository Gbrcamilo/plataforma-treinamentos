'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao entrar'); return }
      window.location.href = data.redirect
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Visual side */}
      <div className="login-visual">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Logo">
              <rect width="44" height="44" rx="12" fill="white" fillOpacity="0.15" />
              <path d="M12 16h8v2h-8zM12 21h8v2h-8zM12 26h5v2h-5zM24 14l8 8-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Plataforma</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>de Treinamentos</div>
            </div>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.15, marginBottom: '20px', maxWidth: '440px' }}>
            Desenvolva sua equipe com treinamentos eficazes
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '380px', lineHeight: 1.7 }}>
            Gerencie trilhas de aprendizagem, acompanhe o progresso da equipe e emita certificados em um único lugar.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
            {[['98%','Satisfação'], ['12k+','Colaboradores'], ['500+','Cursos']].map(([val, label]) => (
              <div key={label}>
                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="login-form-side">
        <div className="login-form-box">
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div className="sidebar-logo-mark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 7h6v1.5H4zM4 10h6v1.5H4zM4 13h4v1.5H4zM12 5l6 5-6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Plataforma de Treinamentos</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>Bem-vindo de volta</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Entre com seu e-mail corporativo para acessar</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">E-mail</label>
              <input
                id="email" type="email" required autoFocus
                className="form-input"
                placeholder="seu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Senha</label>
                <button type="button" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Esqueci a senha</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password" type={showPass ? 'text' : 'password'} required
                  className="form-input"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--color-error-light)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: '32px', padding: '16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>ACESSO DE DEMONSTRAÇÃO</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>admin@treinamentos.com / Admin@123</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
