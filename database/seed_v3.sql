-- ============================================================
-- SEED v3 — Plataforma de Treinamentos HDS
-- Senhas geradas com bcrypt (cost 10)
-- admin@hospital.com    → Admin@2026
-- gestor@hospital.com   → Gestor@2026
-- colaborador@hospital.com → Colab@2026
-- ============================================================

TRUNCATE TABLE matriculas, matriculas_trilhas, trilha_cursos, trilhas, cursos, usuarios RESTART IDENTITY CASCADE;

-- USUÁRIOS
INSERT INTO usuarios (nome, email, senha_hash, perfil, area, status) VALUES
  ('Administrador HDS',  'admin@hospital.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',       'TI',            'ativo'),
  ('Ana Souza',          'ana@hospital.com',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor',      'Tecnologia',    'ativo'),
  ('Carlos Lima',        'carlos@hospital.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'Assistência',   'ativo'),
  ('Beatriz Melo',       'beatriz@hospital.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'RH',            'ativo'),
  ('Diego Faria',        'diego@hospital.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor',      'Administrativo','ativo'),
  ('Fernanda Reis',      'fernanda@hospital.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'Segurança',     'inativo'),
  ('Ricardo Neves',      'ricardo@hospital.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'Tecnologia',    'ativo');

-- CURSOS
INSERT INTO cursos (titulo, categoria, carga_horaria, obrigatorio, status) VALUES
  ('Integração e Onboarding',       'Onboarding',  4,  true,  'publicado'),
  ('LGPD e Proteção de Dados',      'Compliance',  8,  true,  'publicado'),
  ('NR-32 Segurança Hospitalar',    'Segurança',   16, true,  'publicado'),
  ('Prontuário Eletrônico Soul MV', 'Técnico',     12, false, 'publicado'),
  ('Liderança e Gestão de Equipes', 'Gestão',      20, false, 'rascunho'),
  ('Atendimento ao Paciente',       'Assistência', 6,  true,  'publicado');

-- TRILHAS
INSERT INTO trilhas (titulo, descricao, status) VALUES
  ('Onboarding Completo',    'Trilha de boas-vindas para novos colaboradores', 'ativo'),
  ('Compliance & Segurança', 'Treinamentos obrigatórios de conformidade',      'ativo'),
  ('Liderança Hospitalar',   'Desenvolvimento de líderes e gestores',          'ativo'),
  ('Técnico Soul MV',        'Sistema de prontuário eletrônico',               'rascunho');

-- TRILHA → CURSOS
INSERT INTO trilha_cursos (trilha_id, curso_id, ordem) VALUES
  (1, 1, 1), (1, 6, 2), (1, 2, 3),
  (2, 2, 1), (2, 3, 2), (2, 6, 3),
  (3, 5, 1), (3, 4, 2),
  (4, 4, 1);

-- MATRÍCULAS
INSERT INTO matriculas (usuario_id, curso_id, status, progresso) VALUES
  -- Carlos Lima (colaborador/Assistência)
  (3, 1, 'concluido',    100),
  (3, 2, 'em_andamento', 60),
  (3, 3, 'em_andamento', 30),
  (3, 6, 'concluido',    100),
  -- Beatriz Melo (colaborador/RH)
  (4, 1, 'concluido',    100),
  (4, 2, 'concluido',    100),
  (4, 6, 'concluido',    100),
  (4, 4, 'em_andamento', 45),
  -- Ricardo Neves (colaborador/Tecnologia)
  (7, 1, 'concluido',    100),
  (7, 2, 'concluido',    100),
  (7, 3, 'concluido',    100),
  (7, 4, 'concluido',    100),
  (7, 6, 'concluido',    100),
  -- Fernanda Reis (colaborador/Segurança - inativo)
  (6, 1, 'concluido',    100),
  (6, 3, 'em_andamento', 20);
