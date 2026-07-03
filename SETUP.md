# Plataforma de Treinamentos — Setup

## Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Banco de dados**: PostgreSQL via [Neon](https://neon.tech) (serverless)
- **Autenticação**: JWT com `jose` + cookie `httpOnly`
- **Validação**: Zod
- **Criptografia**: bcryptjs (12 rounds)

---

## 1. Clonar e instalar

```bash
git clone https://github.com/Gbrcamilo/plataforma-treinamentos.git
cd plataforma-treinamentos
npm install
```

---

## 2. Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=sua-chave-secreta-super-segura-aqui
NODE_ENV=development
```

---

## 3. Criar banco de dados (Neon)

1. Acesse [neon.tech](https://neon.tech) e crie um projeto gratuito
2. Copie a connection string para `DATABASE_URL`
3. Execute o schema:

```bash
# Via psql
psql $DATABASE_URL -f database/schema.sql

# Depois o seed de dados de teste
psql $DATABASE_URL -f database/seed.sql
```

---

## 4. Rodar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000/login

### Credenciais de demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@hospital.com | 123456 |
| Gestor | gestor@hospital.com | 123456 |
| Colaborador | colaborador@hospital.com | 123456 |

---

## 5. Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

Configurar variáveis no painel da Vercel:
- `DATABASE_URL`
- `JWT_SECRET`

---

## Arquitetura de APIs

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/api/auth/login` | Público | Autenticação com e-mail/senha |
| POST | `/api/auth/logout` | Autenticado | Encerrar sessão |
| GET | `/api/auth/me` | Autenticado | Dados do usuário logado |
| GET/POST | `/api/usuarios` | Admin, Gestor | Listar / criar usuários |
| GET/PATCH/DELETE | `/api/usuarios/[id]` | Admin, Gestor | Ler / editar / desativar |
| GET/POST | `/api/cursos` | Autenticado / Admin | Listar / criar cursos |
| GET/PATCH/DELETE | `/api/cursos/[id]` | Autenticado / Admin | Operações por curso |
| GET/POST | `/api/trilhas` | Autenticado / Admin | Listar / criar trilhas |
| GET/POST | `/api/progresso` | Autenticado | Consultar / salvar progresso |
| GET | `/api/certificados` | Autenticado | Listar certificados |
| GET | `/api/admin/dashboard` | Admin, Gestor | KPIs consolidados |
| GET | `/api/gestor/equipe` | Admin, Gestor | Dados da equipe com conformidade |
| GET | `/api/colaborador/meus-cursos` | Colaborador | Cursos do colaborador logado |
