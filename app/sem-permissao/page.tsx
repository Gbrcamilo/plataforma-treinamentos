'use client'
import { useRouter } from 'next/navigation'

export default function SemPermissao() {
  const router = useRouter()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f172a', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚫</div>
        <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Acesso negado</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Você não tem permissão para acessar essa área. Entre em contato com o administrador.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >← Voltar</button>
          <button
            onClick={() => router.push('/login')}
            style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >Ir para Login</button>
        </div>
      </div>
    </div>
  )
}
