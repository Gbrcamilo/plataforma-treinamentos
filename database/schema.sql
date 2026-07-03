-- ============================================================
-- PLATAFORMA DE TREINAMENTOS — SCHEMA PRINCIPAL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SETORES
CREATE TABLE IF NOT EXISTS setores (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  descricao   TEXT,
  ativo       BOOLEAN DEFAULT true,
  criado_em   TIMESTAMP DEFAULT NOW()
);

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(150) NOT NULL,
  email        VARCHAR(150) UNIQUE NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  perfil       VARCHAR(20)  NOT NULL CHECK (perfil IN ('admin','gestor','colaborador')),
  cargo        VARCHAR(100),
  setor_id     INT REFERENCES setores(id) ON DELETE SET NULL,
  ativo        BOOLEAN DEFAULT true,
  criado_em    TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email  ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_setor  ON usuarios(setor_id);

-- CURSOS
CREATE TABLE IF NOT EXISTS cursos (
  id            SERIAL PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  categoria     VARCHAR(100) NOT NULL,
  carga_horaria INT NOT NULL DEFAULT 1,
  obrigatorio   BOOLEAN DEFAULT false,
  prazo_dias    INT,
  ativo         BOOLEAN DEFAULT true,
  criado_em     TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cursos_categoria   ON cursos(categoria);
CREATE INDEX IF NOT EXISTS idx_cursos_obrigatorio ON cursos(obrigatorio);

-- TRILHAS
CREATE TABLE IF NOT EXISTS trilhas (
  id           SERIAL PRIMARY KEY,
  titulo       VARCHAR(200) NOT NULL,
  descricao    TEXT,
  obrigatorio  BOOLEAN DEFAULT false,
  prazo_dias   INT,
  ativo        BOOLEAN DEFAULT true,
  criado_em    TIMESTAMP DEFAULT NOW()
);

-- TRILHA_CURSOS (many-to-many)
CREATE TABLE IF NOT EXISTS trilha_cursos (
  trilha_id  INT REFERENCES trilhas(id) ON DELETE CASCADE,
  curso_id   INT REFERENCES cursos(id)  ON DELETE CASCADE,
  ordem      INT DEFAULT 0,
  PRIMARY KEY (trilha_id, curso_id)
);

-- PROGRESSOS
CREATE TABLE IF NOT EXISTS progressos (
  id             SERIAL PRIMARY KEY,
  usuario_id     INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id       INT NOT NULL REFERENCES cursos(id)   ON DELETE CASCADE,
  status         VARCHAR(20) NOT NULL DEFAULT 'nao_iniciado'
                   CHECK (status IN ('nao_iniciado','em_andamento','concluido')),
  progresso_pct  INT DEFAULT 0 CHECK (progresso_pct BETWEEN 0 AND 100),
  nota           NUMERIC(4,1) CHECK (nota BETWEEN 0 AND 10),
  concluido_em   TIMESTAMP,
  criado_em      TIMESTAMP DEFAULT NOW(),
  atualizado_em  TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuario_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_progressos_usuario ON progressos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progressos_curso   ON progressos(curso_id);
CREATE INDEX IF NOT EXISTS idx_progressos_status  ON progressos(status);

-- CERTIFICADOS
CREATE TABLE IF NOT EXISTS certificados (
  id            SERIAL PRIMARY KEY,
  usuario_id    INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id      INT NOT NULL REFERENCES cursos(id)   ON DELETE CASCADE,
  codigo        VARCHAR(60) UNIQUE NOT NULL,
  carga_horaria INT NOT NULL DEFAULT 0,
  emitido_em    TIMESTAMP DEFAULT NOW(),
  validade_em   TIMESTAMP GENERATED ALWAYS AS (emitido_em + INTERVAL '1 year') STORED,
  UNIQUE (usuario_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_certificados_usuario ON certificados(usuario_id);

-- AVALIACOES
CREATE TABLE IF NOT EXISTS avaliacoes (
  id           SERIAL PRIMARY KEY,
  curso_id     INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo       VARCHAR(200) NOT NULL,
  nota_minima  NUMERIC(4,1) DEFAULT 7.0,
  tentativas   INT DEFAULT 3,
  ativo        BOOLEAN DEFAULT true,
  criado_em    TIMESTAMP DEFAULT NOW()
);

-- QUESTOES
CREATE TABLE IF NOT EXISTS questoes (
  id            SERIAL PRIMARY KEY,
  avaliacao_id  INT NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  enunciado     TEXT NOT NULL,
  alternativas  JSONB NOT NULL,  -- [{"id":"a","texto":"..."}]
  resposta_certa VARCHAR(5) NOT NULL,
  pontos        INT DEFAULT 1
);

-- NOTIFICACOES
CREATE TABLE IF NOT EXISTS notificacoes (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT REFERENCES usuarios(id) ON DELETE CASCADE,  -- NULL = todos
  titulo      VARCHAR(200) NOT NULL,
  mensagem    TEXT NOT NULL,
  tipo        VARCHAR(20) DEFAULT 'info' CHECK (tipo IN ('info','urgente','sucesso','aviso')),
  lida        BOOLEAN DEFAULT false,
  criado_em   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_usuario ON notificacoes(usuario_id);
