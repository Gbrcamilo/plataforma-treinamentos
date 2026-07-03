export default function SemPermissao() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: '4rem' }}>🔒</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Sem Permissão</h1>
      <p style={{ color: '#6b6a65', maxWidth: '36ch', textAlign: 'center' }}>Você não tem acesso a esta área. Caso acredite que isso é um erro, entre em contato com o administrador.</p>
      <a href="/login" style={{ marginTop: '8px', padding: '10px 24px', background: '#01696f', color: '#fff', borderRadius: '8px', fontWeight: 500, textDecoration: 'none' }}>← Voltar ao Login</a>
    </div>
  )
}
