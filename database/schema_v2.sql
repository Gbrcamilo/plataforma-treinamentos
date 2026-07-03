-- ============================================================
-- PLATAFORMA LMS HOSPITALAR v2
-- PostgreSQL / Neon — Schema completo
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca textual

-- ======================== ENUMS ============================
CREATE TYPE perfil_enum        AS ENUM ('admin','gestor','colaborador');
CREATE TYPE status_user_enum   AS ENUM ('ativo','inativo','suspenso','pendente');
CREATE TYPE formato_enum       AS ENUM ('video','pdf','scorm','quiz','jogo','presencial','hibrido');
CREATE TYPE status_curso_enum  AS ENUM ('rascunho','publicado','arquivado','em_revisao');
CREATE TYPE status_mat_enum    AS ENUM ('pendente','em_andamento','concluido','cancelado','reprovado','expirado');
CREATE TYPE status_aval_enum   AS ENUM ('aguardando','em_andamento','aprovado','reprovado');
CREATE TYPE notif_tipo_enum    AS ENUM ('info','alerta','urgente','sucesso','sistema');
CREATE TYPE audit_acao_enum    AS ENUM ('login','logout','criar','editar','excluir','visualizar','concluir','emitir_certificado','reprovar','aprovar');

-- ======================== ORGANIZAÇÕES =====================
CREATE TABLE IF NOT EXISTS organizacoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(200) NOT NULL,
  cnpj          VARCHAR(18) UNIQUE,
  logo_url      TEXT,
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== UNIDADES =========================
CREATE TABLE IF NOT EXISTS unidades (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  nome          VARCHAR(150) NOT NULL,
  codigo        VARCHAR(20),
  cidade        VARCHAR(100),
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== SETORES ==========================
CREATE TABLE IF NOT EXISTS setores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id    UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  nome          VARCHAR(100) NOT NULL,
  codigo        VARCHAR(20),
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== CARGOS ===========================
CREATE TABLE IF NOT EXISTS cargos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  nome          VARCHAR(100) NOT NULL,
  nivel         SMALLINT DEFAULT 1,
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== USUARIOS =========================
CREATE TABLE IF NOT EXISTS usuarios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  unidade_id    UUID REFERENCES unidades(id) ON DELETE SET NULL,
  setor_id      UUID REFERENCES setores(id) ON DELETE SET NULL,
  cargo_id      UUID REFERENCES cargos(id) ON DELETE SET NULL,
  gestor_id     UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome          VARCHAR(150) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  senha_hash    TEXT NOT NULL,
  perfil        perfil_enum NOT NULL DEFAULT 'colaborador',
  status        status_user_enum NOT NULL DEFAULT 'ativo',
  matricula     VARCHAR(50),
  avatar_url    TEXT,
  mfa_ativo     BOOLEAN DEFAULT FALSE,
  mfa_secret    TEXT,
  ultimo_acesso TIMESTAMPTZ,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email   ON usuarios(email);
CREATE INDEX idx_usuarios_perfil  ON usuarios(perfil);
CREATE INDEX idx_usuarios_gestor  ON usuarios(gestor_id);
CREATE INDEX idx_usuarios_org     ON usuarios(org_id);
CREATE INDEX idx_usuarios_unidade ON usuarios(unidade_id);
CREATE INDEX idx_usuarios_setor   ON usuarios(setor_id);

-- ======================== CATEGORIAS =======================
CREATE TABLE IF NOT EXISTS categorias_curso (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  nome          VARCHAR(100) NOT NULL,
  cor           VARCHAR(7) DEFAULT '#01696f',
  icone         VARCHAR(50),
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== CURSOS ===========================
CREATE TABLE IF NOT EXISTS cursos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  categoria_id      UUID REFERENCES categorias_curso(id) ON DELETE SET NULL,
  criado_por        UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  titulo            VARCHAR(200) NOT NULL,
  descricao         TEXT,
  objetivo          TEXT,
  formato           formato_enum NOT NULL DEFAULT 'video',
  carga_horaria     INTEGER NOT NULL DEFAULT 1,
  obrigatorio       BOOLEAN DEFAULT FALSE,
  status            status_curso_enum NOT NULL DEFAULT 'rascunho',
  nota_minima       NUMERIC(4,1) DEFAULT 7.0,
  max_tentativas    INTEGER DEFAULT 3,
  validade_dias     INTEGER,
  thumbnail_url     TEXT,
  versao            INTEGER DEFAULT 1,
  publicado_em      TIMESTAMPTZ,
  criado_em         TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cursos_status    ON cursos(status);
CREATE INDEX idx_cursos_org       ON cursos(org_id);
CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_cursos_fts       ON cursos USING gin(to_tsvector('portuguese', titulo || ' ' || COALESCE(descricao,'')));

-- ======================== MÓDULOS ==========================
CREATE TABLE IF NOT EXISTS modulos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id      UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  ordem         INTEGER NOT NULL DEFAULT 1,
  obrigatorio   BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== AULAS ============================
CREATE TABLE IF NOT EXISTS aulas (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id         UUID NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  titulo            VARCHAR(200) NOT NULL,
  descricao         TEXT,
  formato           formato_enum NOT NULL DEFAULT 'video',
  url_conteudo      TEXT,
  duracao_segundos  INTEGER DEFAULT 0,
  ordem             INTEGER NOT NULL DEFAULT 1,
  obrigatoria       BOOLEAN DEFAULT TRUE,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aulas_modulo ON aulas(modulo_id);

-- ======================== TRILHAS ==========================
CREATE TABLE IF NOT EXISTS trilhas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  criado_por    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  obrigatoria   BOOLEAN DEFAULT FALSE,
  status        status_curso_enum NOT NULL DEFAULT 'rascunho',
  thumbnail_url TEXT,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trilha_cursos (
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  curso_id  UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  ordem     INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (trilha_id, curso_id)
);

CREATE TABLE IF NOT EXISTS trilha_publico (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trilha_id     UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  unidade_id    UUID REFERENCES unidades(id) ON DELETE CASCADE,
  setor_id      UUID REFERENCES setores(id) ON DELETE CASCADE,
  cargo_id      UUID REFERENCES cargos(id) ON DELETE CASCADE,
  usuario_id    UUID REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ======================== MATRÍCULAS =======================
CREATE TABLE IF NOT EXISTS matriculas (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id            UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  status              status_mat_enum NOT NULL DEFAULT 'pendente',
  progresso           NUMERIC(5,2) DEFAULT 0,
  nota_final          NUMERIC(4,1),
  tentativas          INTEGER DEFAULT 0,
  data_inicio         TIMESTAMPTZ,
  data_conclusao      TIMESTAMPTZ,
  prazo_conclusao     TIMESTAMPTZ,
  certificado_emitido BOOLEAN DEFAULT FALSE,
  certificado_url     TEXT,
  certificado_codigo  VARCHAR(50) UNIQUE,
  criado_em           TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, curso_id)
);

CREATE INDEX idx_mat_usuario  ON matriculas(usuario_id);
CREATE INDEX idx_mat_curso    ON matriculas(curso_id);
CREATE INDEX idx_mat_status   ON matriculas(status);
CREATE INDEX idx_mat_prazo    ON matriculas(prazo_conclusao);
CREATE INDEX idx_mat_cert     ON matriculas(certificado_codigo);

-- ======================== PROGRESSO AULAS ==================
CREATE TABLE IF NOT EXISTS progresso_aulas (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id        UUID NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
  aula_id             UUID NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  concluida           BOOLEAN DEFAULT FALSE,
  segundos_assistidos INTEGER DEFAULT 0,
  percentual          NUMERIC(5,2) DEFAULT 0,
  concluida_em        TIMESTAMPTZ,
  UNIQUE(matricula_id, aula_id)
);

-- ======================== AVALIAÇÕES =======================
CREATE TABLE IF NOT EXISTS avaliacoes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id          UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo            VARCHAR(200) NOT NULL,
  descricao         TEXT,
  nota_minima       NUMERIC(4,1) DEFAULT 7.0,
  max_tentativas    INTEGER DEFAULT 3,
  tempo_limite_min  INTEGER,
  embaralhar        BOOLEAN DEFAULT TRUE,
  ativa             BOOLEAN DEFAULT TRUE,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avaliacao_id  UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  enunciado     TEXT NOT NULL,
  tipo          VARCHAR(30) DEFAULT 'multipla_escolha',
  pontos        NUMERIC(4,1) DEFAULT 1.0,
  ordem         INTEGER DEFAULT 1,
  imagem_url    TEXT
);

CREATE TABLE IF NOT EXISTS alternativas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questao_id  UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  correta     BOOLEAN DEFAULT FALSE,
  feedback    TEXT,
  ordem       INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tentativas_avaliacao (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id      UUID NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
  avaliacao_id      UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  numero_tentativa  INTEGER NOT NULL DEFAULT 1,
  nota              NUMERIC(4,1),
  status            status_aval_enum NOT NULL DEFAULT 'aguardando',
  respostas         JSONB,
  iniciada_em       TIMESTAMPTZ DEFAULT NOW(),
  finalizada_em     TIMESTAMPTZ
);

-- ======================== JOGOS ============================
CREATE TABLE IF NOT EXISTS jogos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id      UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  tipo          VARCHAR(50) DEFAULT 'decisao_clinica',
  config_json   JSONB,
  pontos_max    INTEGER DEFAULT 100,
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partidas_jogo (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jogo_id       UUID NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pontuacao     INTEGER DEFAULT 0,
  concluido     BOOLEAN DEFAULT FALSE,
  tempo_segundos INTEGER DEFAULT 0,
  resultado_json JSONB,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== CERTIFICADOS =====================
CREATE TABLE IF NOT EXISTS regras_certificado (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  curso_id          UUID REFERENCES cursos(id) ON DELETE CASCADE,
  validade_dias     INTEGER,
  nota_minima       NUMERIC(4,1) DEFAULT 7.0,
  exige_progresso   NUMERIC(5,2) DEFAULT 100.0,
  template_html     TEXT,
  ativo             BOOLEAN DEFAULT TRUE,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== REGRAS DE COMPLIANCE =============
CREATE TABLE IF NOT EXISTS compliance_regras (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            UUID NOT NULL REFERENCES organizacoes(id) ON DELETE CASCADE,
  nome              VARCHAR(200) NOT NULL,
  descricao         TEXT,
  curso_id          UUID REFERENCES cursos(id),
  trilha_id         UUID REFERENCES trilhas(id),
  prazo_dias        INTEGER,
  recorrencia_dias  INTEGER,
  aplica_a_perfil   perfil_enum,
  aplica_a_cargo    UUID REFERENCES cargos(id),
  aplica_a_setor    UUID REFERENCES setores(id),
  ativo             BOOLEAN DEFAULT TRUE,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== NOTIFICAÇÕES =====================
CREATE TABLE IF NOT EXISTS notificacoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo      VARCHAR(200) NOT NULL,
  mensagem    TEXT NOT NULL,
  tipo        notif_tipo_enum DEFAULT 'info',
  lida        BOOLEAN DEFAULT FALSE,
  link        TEXT,
  referencia_id UUID,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notif_lida    ON notificacoes(lida);

-- ======================== AUDIT LOG ========================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      UUID REFERENCES organizacoes(id),
  usuario_id  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  acao        audit_acao_enum NOT NULL,
  entidade    VARCHAR(50),
  entidade_id UUID,
  descricao   TEXT,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  dados_antes JSONB,
  dados_depois JSONB,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org      ON audit_logs(org_id);
CREATE INDEX idx_audit_usuario  ON audit_logs(usuario_id);
CREATE INDEX idx_audit_acao     ON audit_logs(acao);
CREATE INDEX idx_audit_entidade ON audit_logs(entidade, entidade_id);
CREATE INDEX idx_audit_data     ON audit_logs(criado_em DESC);

-- ======================== VERSÕES DE CONTEÚDO ==============
CREATE TABLE IF NOT EXISTS content_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entidade    VARCHAR(50) NOT NULL,
  entidade_id UUID NOT NULL,
  versao      INTEGER NOT NULL,
  alterado_por UUID REFERENCES usuarios(id),
  snapshot    JSONB,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ======================== SESSÕES ==========================
CREATE TABLE IF NOT EXISTS sessoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  expira_em   TIMESTAMPTZ NOT NULL,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX idx_sessoes_token   ON sessoes(token_hash);

-- ======================== VIEWS DE RELATÓRIO ===============

-- View: resumo por colaborador
CREATE OR REPLACE VIEW vw_resumo_colaborador AS
SELECT
  u.id as usuario_id,
  u.nome,
  u.email,
  u.perfil,
  u.org_id,
  u.unidade_id,
  u.setor_id,
  un.nome as unidade_nome,
  s.nome  as setor_nome,
  c.nome  as cargo_nome,
  COUNT(m.id)                                              AS total_matriculas,
  COUNT(m.id) FILTER (WHERE m.status = 'pendente')         AS pendentes,
  COUNT(m.id) FILTER (WHERE m.status = 'em_andamento')     AS em_andamento,
  COUNT(m.id) FILTER (WHERE m.status = 'concluido')        AS concluidos,
  COUNT(m.id) FILTER (WHERE m.status = 'reprovado')        AS reprovados,
  COUNT(m.id) FILTER (WHERE m.status = 'expirado')         AS expirados,
  COUNT(m.id) FILTER (WHERE m.certificado_emitido = TRUE)  AS certificados,
  COUNT(m.id) FILTER (
    WHERE m.status IN ('pendente','em_andamento')
    AND m.prazo_conclusao < NOW() + INTERVAL '7 days'
    AND m.prazo_conclusao > NOW()
  )                                                        AS vencendo_7_dias,
  COUNT(m.id) FILTER (
    WHERE m.status IN ('pendente','em_andamento')
    AND m.prazo_conclusao < NOW()
  )                                                        AS vencidos,
  COALESCE(SUM(cr.carga_horaria) FILTER (WHERE m.status = 'concluido'), 0) AS horas_treinadas,
  CASE
    WHEN COUNT(m.id) FILTER (WHERE m.status IN ('pendente','em_andamento','concluido','reprovado')) > 0
    THEN ROUND(
      COUNT(m.id) FILTER (WHERE m.status = 'concluido') * 100.0 /
      NULLIF(COUNT(m.id) FILTER (WHERE m.status IN ('pendente','em_andamento','concluido','reprovado')), 0)
    )
    ELSE 0
  END AS taxa_conclusao
FROM usuarios u
LEFT JOIN unidades un ON u.unidade_id = un.id
LEFT JOIN setores s   ON u.setor_id = s.id
LEFT JOIN cargos c    ON u.cargo_id = c.id
LEFT JOIN matriculas m ON u.id = m.usuario_id
LEFT JOIN cursos cr    ON m.curso_id = cr.id
GROUP BY u.id, u.nome, u.email, u.perfil, u.org_id, u.unidade_id, u.setor_id,
         un.nome, s.nome, c.nome;

-- View: resumo por curso
CREATE OR REPLACE VIEW vw_resumo_curso AS
SELECT
  cr.id as curso_id,
  cr.titulo,
  cr.formato,
  cr.carga_horaria,
  cr.obrigatorio,
  cr.status,
  cr.org_id,
  cat.nome as categoria_nome,
  COUNT(m.id)                                              AS total_matriculados,
  COUNT(m.id) FILTER (WHERE m.status = 'concluido')        AS concluidos,
  COUNT(m.id) FILTER (WHERE m.status = 'em_andamento')     AS em_andamento,
  COUNT(m.id) FILTER (WHERE m.status = 'reprovado')        AS reprovados,
  ROUND(AVG(m.nota_final) FILTER (WHERE m.nota_final IS NOT NULL), 1) AS media_nota,
  CASE
    WHEN COUNT(m.id) > 0
    THEN ROUND(COUNT(m.id) FILTER (WHERE m.status = 'concluido') * 100.0 / COUNT(m.id))
    ELSE 0
  END AS taxa_conclusao
FROM cursos cr
LEFT JOIN categorias_curso cat ON cr.categoria_id = cat.id
LEFT JOIN matriculas m ON cr.id = m.curso_id
GROUP BY cr.id, cr.titulo, cr.formato, cr.carga_horaria, cr.obrigatorio, cr.status, cr.org_id, cat.nome;

-- View: compliance geral por setor
CREATE OR REPLACE VIEW vw_compliance_setor AS
SELECT
  s.id as setor_id,
  s.nome as setor_nome,
  un.nome as unidade_nome,
  COUNT(DISTINCT u.id) AS total_colaboradores,
  COUNT(m.id) FILTER (WHERE m.status = 'concluido') AS treinamentos_ok,
  COUNT(m.id) FILTER (WHERE m.status IN ('pendente','em_andamento') AND m.prazo_conclusao < NOW()) AS vencidos,
  COUNT(m.id) FILTER (WHERE cr.obrigatorio = TRUE AND m.status NOT IN ('concluido')) AS obrigatorios_pendentes,
  CASE
    WHEN COUNT(DISTINCT u.id) > 0
    THEN ROUND(
      COUNT(DISTINCT u.id) FILTER (WHERE u.id IN (
        SELECT DISTINCT usuario_id FROM matriculas
        WHERE status IN ('pendente','em_andamento')
        AND prazo_conclusao IS NOT NULL
        AND prazo_conclusao < NOW()
      )) * 100.0 / COUNT(DISTINCT u.id)
    )
    ELSE 0
  END AS pct_inadimplentes
FROM setores s
LEFT JOIN unidades un ON s.unidade_id = un.id
LEFT JOIN usuarios u  ON u.setor_id = s.id AND u.status = 'ativo'
LEFT JOIN matriculas m ON u.id = m.usuario_id
LEFT JOIN cursos cr ON m.curso_id = cr.id
GROUP BY s.id, s.nome, un.nome;

-- ======================== TRIGGERS ========================
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_ts  BEFORE UPDATE ON usuarios  FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_cursos_ts    BEFORE UPDATE ON cursos    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_matriculas_ts BEFORE UPDATE ON matriculas FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_trilhas_ts   BEFORE UPDATE ON trilhas   FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
