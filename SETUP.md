# Setup da Plataforma de Treinamentos

## Stack

- **Framework**: Next.js 14 (App Router)
- **Banco de dados**: Neon PostgreSQL (gratuito)
- **Hospedagem**: Vercel (gratuito)
- **Auth**: JWT com jose + bcryptjs
- **Linguagem**: TypeScript

---

## 1. Banco de dados — Neon (gratuito)

1. Acesse [https://neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto: `plataforma-treinamentos`
3. Copie a **Connection String** (formato: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Execute o schema no painel SQL do Neon:
   - Abra o **SQL Editor** no Neon
   - Cole e execute o conteúdo de `database/schema.sql`
   - Cole e execute o conteúdo de `database/seed.sql`

---

## 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="sua-connection-string-do-neon"
JWT_SECRET="uma-chave-secreta-longa-e-aleatoria-minimo-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

**Login padrão (admin)**:
- E-mail: `admin@treinamentos.com`
- Senha: `Admin@123`

---

## 4. Deploy no Vercel

### Opção A — Via interface (mais fácil)
1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **Add New Project**
3. Importe o repositório `Gbrcamilo/plataforma-treinamentos`
4. Em **Environment Variables**, adicione:
   - `DATABASE_URL` → sua connection string do Neon
   - `JWT_SECRET` → sua chave secreta
5. Clique em **Deploy**

### Opção B — Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Integração Neon ↔ Vercel (recomendado)
- No painel do Vercel → **Storage** → **Connect Database** → selecione **Neon**
- O `DATABASE_URL` é configurado automaticamente

---

## 5. Estrutura de pastas

```
plataforma-treinamentos/
├── app/
│   ├── api/
│   │   ├── auth/login/      → POST login
│   │   ├── auth/logout/     → POST logout
│   │   ├── admin/dashboard/ → GET indicadores admin
│   │   ├── gestor/equipe/   → GET equipe do gestor
│   │   ├── colaborador/dashboard/ → GET dashboard colaborador
│   │   └── cursos/          → GET lista de cursos
│   ├── admin/               → Páginas do administrador
│   ├── gestor/              → Páginas do gestor
│   ├── colaborador/         → Páginas do colaborador
│   └── login/               → Página de login
├── lib/
│   ├── db.ts                → Conexão Neon
│   ├── auth.ts              → JWT + bcrypt
│   └── types.ts             → Tipos TypeScript
├── database/
│   ├── schema.sql           → Schema completo do banco
│   ├── seed.sql             → Dados iniciais
│   └── migrate.js           → Script de migração
├── middleware.ts             → Proteção de rotas por perfil
├── vercel.json              → Config Vercel (região São Paulo)
└── .env.example             → Exemplo de variáveis
```

---

## 6. Credenciais padrão após o seed

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | admin@treinamentos.com | Admin@123 |

> ⚠️ Troque a senha do admin logo após o primeiro acesso em produção.

---

## 7. Limites gratuitos

| Serviço | Plano gratuito |
|---|---|
| **Neon** | 512 MB storage, 190 compute hours/mês |
| **Vercel** | 100 GB bandwidth, deployments ilimitados |
