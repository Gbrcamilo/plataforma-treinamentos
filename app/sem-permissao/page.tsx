'use client'
import Link from 'next/link'

export default function SemPermissao() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-8)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 72, marginBottom: 'var(--space-4)' }}>🔒</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-2)',
        color: 'var(--color-text)',
      }}>Acesso Negado</h1>
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-text-muted)',
        maxWidth: 400,
        marginBottom: 'var(--space-8)',
      }}>
        Você não tem permissão para acessar esta página.
        Entre em contato com o administrador se acreditar que isso é um erro.
      </p>
      <Link href="/login" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'var(--color-primary)',
        color: '#fff',
        padding: 'var(--space-3) var(--space-6)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        textDecoration: 'none',
      }}>
        ← Voltar ao Login
      </Link>
    </div>
  )
}
