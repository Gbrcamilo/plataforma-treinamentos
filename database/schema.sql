-- ==============================================
-- PLATAFORMA DE TREINAMENTOS
-- Schema PostgreSQL (Neon - gratuito)
-- ==============================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- ENUM TYPES
-- ==============================================

CREATE TYPE perfil_enum AS ENUM ('admin', 'gestor', 'colaborador');
CREATE TYPE status_enum AS ENUM ('ativo', 'inativo', 'suspenso');
CREATE TYPE formato_enum AS ENUM ('video', 'pdf', 'scorm', 'quiz', 'presencial', 'hibrido');
CREATE TYPE status_curso_enum AS ENUM ('rascunho', 'publicado', 'arquivado');
CREATE TYPE status_matricula_enum AS ENUM ('pendente', 'em_andamento', 'concluido', 'cancelado', 'reprovado');
CREATE TYPE status_avaliacao_enum AS ENUM ('aguardando', 'em_andamento', 'aprovado', 'reprovado');

-- ==============================================
-- TABELA: areas
-- ==============================================
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- TABELA: cargos
-- ==============================================
CREATE TABLE IF NOT EXISTS cargos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- TABELA: usuarios
-- ==============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  perfil perfil_enum NOT NULL DEFAULT 'colaborador',
  status status_enum NOT NULL DEFAULT 'ativo',
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  cargo_id UUID REFERENCES cargos(id) ON DELETE SET NULL,
  gestor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  avatar_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  ultimo_acesso TIMESTAMPTZ
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX idx_usuarios_gestor ON usuarios(gestor_id);
CREATE INDEX idx_usuarios_area ON usuarios(area_id);

-- ==============================================
-- TABELA: categorias_curso
-- ==============================================
CREATE TABLE IF NOT EXISTS categorias_curso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(7) DEFAULT '#01696f',
  icone VARCHAR(50),
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- TABELA: cursos
-- ==============================================
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES categorias_curso(id) ON DELETE SET NULL,
  formato formato_enum NOT NULL DEFAULT 'video',
  carga_horaria INTEGER NOT NULL DEFAULT 1,
  obrigatorio BOOLEAN DEFAULT FALSE,
  status status_curso_enum NOT NULL DEFAULT 'rascunho',
  nota_minima NUMERIC(4,1) DEFAULT 7.0,
  max_tentativas INTEGER DEFAULT 3,
  validade_dias INTEGER,
  thumbnail_url TEXT,
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  publicado_em TIMESTAMPTZ
);

CREATE INDEX idx_cursos_status ON cursos(status);
CREATE INDEX idx_cursos_obrigatorio ON cursos(obrigatorio);
CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);

-- ==============================================
-- TABELA: aulas
-- ==============================================
CREATE TABLE IF NOT EXISTS aulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  formato formato_enum NOT NULL DEFAULT 'video',
  url_conteudo TEXT,
  duracao_segundos INTEGER DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 1,
  obrigatoria BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aulas_curso ON aulas(curso_id);

-- ==============================================
-- TABELA: trilhas
-- ==============================================
CREATE TABLE IF NOT EXISTS trilhas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  obrigatoria BOOLEAN DEFAULT FALSE,
  status status_curso_enum NOT NULL DEFAULT 'rascunho',
  thumbnail_url TEXT,
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- TABELA: trilha_cursos (cursos dentro da trilha)
-- ==============================================
CREATE TABLE IF NOT EXISTS trilha_cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 1,
  obrigatorio BOOLEAN DEFAULT TRUE,
  UNIQUE(trilha_id, curso_id)
);

-- ==============================================
-- TABELA: trilha_publico (quem deve fazer a trilha)
-- ==============================================
CREATE TABLE IF NOT EXISTS trilha_publico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  cargo_id UUID REFERENCES cargos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==============================================
-- TABELA: matriculas
-- ==============================================
CREATE TABLE IF NOT EXISTS matriculas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  status status_matricula_enum NOT NULL DEFAULT 'pendente',
  progresso NUMERIC(5,2) DEFAULT 0,
  nota_final NUMERIC(4,1),
  data_inicio TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,
  prazo_conclusao TIMESTAMPTZ,
  certificado_emitido BOOLEAN DEFAULT FALSE,
  certificado_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, curso_id)
);

CREATE INDEX idx_matriculas_usuario ON matriculas(usuario_id);
CREATE INDEX idx_matriculas_curso ON matriculas(curso_id);
CREATE INDEX idx_matriculas_status ON matriculas(status);
CREATE INDEX idx_matriculas_prazo ON matriculas(prazo_conclusao);

-- ==============================================
-- TABELA: progresso_aulas
-- ==============================================
CREATE TABLE IF NOT EXISTS progresso_aulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
  aula_id UUID NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  concluida BOOLEAN DEFAULT FALSE,
  segundos_assistidos INTEGER DEFAULT 0,
  concluida_em TIMESTAMPTZ,
  UNIQUE(matricula_id, aula_id)
);

-- ==============================================
-- TABELA: avaliacoes
-- ==============================================
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  nota_minima NUMERIC(4,1) DEFAULT 7.0,
  max_tentativas INTEGER DEFAULT 3,
  tempo_limite_minutos INTEGER,
  ativa BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- TABELA: questoes
-- ==============================================
CREATE TABLE IF NOT EXISTS questoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'multipla_escolha',
  pontos NUMERIC(4,1) DEFAULT 1.0,
  ordem INTEGER DEFAULT 1
);

-- ==============================================
-- TABELA: alternativas
-- ==============================================
CREATE TABLE IF NOT EXISTS alternativas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  correta BOOLEAN DEFAULT FALSE,
  ordem INTEGER DEFAULT 1
);

-- ==============================================
-- TABELA: tentativas_avaliacao
-- ==============================================
CREATE TABLE IF NOT EXISTS tentativas_avaliacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  numero_tentativa INTEGER NOT NULL DEFAULT 1,
  nota NUMERIC(4,1),
  status status_avaliacao_enum NOT NULL DEFAULT 'aguardando',
  iniciada_em TIMESTAMPTZ DEFAULT NOW(),
  finalizada_em TIMESTAMPTZ
);

-- ==============================================
-- TABELA: notificacoes
-- ==============================================
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'info',
  lida BOOLEAN DEFAULT FALSE,
  link TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);

-- ==============================================
-- TABELA: sessoes (JWT refresh tokens)
-- ==============================================
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expira_em TIMESTAMPTZ NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX idx_sessoes_token ON sessoes(token_hash);

-- ==============================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- ==============================================
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER trg_cursos_updated
  BEFORE UPDATE ON cursos
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER trg_matriculas_updated
  BEFORE UPDATE ON matriculas
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
