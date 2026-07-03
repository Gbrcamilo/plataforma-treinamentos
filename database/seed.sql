-- ============================================================
-- SEED — Dados iniciais para desenvolvimento
-- ============================================================

-- SETORES
INSERT INTO setores (nome) VALUES
  ('UTI Central'),
  ('Administrativo'),
  ('Farmácia'),
  ('Enfermagem'),
  ('TI'),
  ('RH')
ON CONFLICT DO NOTHING;

-- USUARIOS (senhas = 123456)
-- Hash bcrypt de "123456" com 12 rounds
INSERT INTO usuarios (nome, email, senha_hash, perfil, cargo, setor_id) VALUES
  ('Admin Sistema',    'admin@hospital.com',       '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'admin',       'Administrador', NULL),
  ('Maria Gestora',   'gestor@hospital.com',       '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'gestor',      'Gestora de TI',    5),
  ('João Pereira',    'colaborador@hospital.com',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'colaborador', 'Técnico de Enfermagem', 1),
  ('Ana Paula Souza', 'ana@hospital.com',          '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'colaborador', 'Enfermeira',    1),
  ('Carlos Mendes',   'carlos@hospital.com',       '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'colaborador', 'Técnico de TI',    5),
  ('Fernanda Lima',   'fernanda@hospital.com',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJbMRFl9.KH0Rgsa', 'colaborador', 'Farmacêutica',   3)
ON CONFLICT (email) DO NOTHING;

-- CURSOS
INSERT INTO cursos (titulo, descricao, categoria, carga_horaria, obrigatorio, prazo_dias) VALUES
  ('Segurança do Paciente',         'Boas práticas de segurança hospitalar',       'Obrigatório',  8,  true,  30),
  ('LGPD na Saúde',                 'Lei Geral de Proteção de Dados na área da saúde', 'Obrigatório', 4, true,  60),
  ('Prevenção de Infecções',        'Controle de infecções hospitalares',          'Obrigatório',  6,  true,  30),
  ('Comunicação Não Violenta',      'Técnicas de comunicação efetiva',             'Complementar', 4,  false, 90),
  ('Excel para Saúde',              'Planilhas aplicadas à gestão hospitalar',     'Complementar', 8,  false, 120),
  ('Gestão de Resíduos',            'Descarte correto de resíduos hospitalares',   'Obrigatório',  4,  true,  45),
  ('Primeiros Socorros',            'Procedimentos básicos de emergência',         'Obrigatório',  6,  true,  30),
  ('Liderança e Gestão de Equipes', 'Desenvolvimento de líderes na saúde',         'Desenvolvimento', 16, false, 180)
ON CONFLICT DO NOTHING;

-- TRILHAS
INSERT INTO trilhas (titulo, descricao, obrigatorio, prazo_dias) VALUES
  ('Onboarding Clínico',         'Trilha obrigatória para novos colaboradores da área clínica', true,  30),
  ('Conformidade e Compliance',  'Trilha de conformidade regulatória hospitalar',               true,  60),
  ('Desenvolvimento Profissional','Habilidades complementares para crescimento na carreira',    false, 180)
ON CONFLICT DO NOTHING;

-- TRILHA_CURSOS
INSERT INTO trilha_cursos (trilha_id, curso_id, ordem) VALUES
  (1, 1, 1), (1, 3, 2), (1, 7, 3),
  (2, 2, 1), (2, 6, 2),
  (3, 4, 1), (3, 5, 2), (3, 8, 3)
ON CONFLICT DO NOTHING;

-- PROGRESSOS EXEMPLO
INSERT INTO progressos (usuario_id, curso_id, status, progresso_pct, nota, concluido_em) VALUES
  (3, 1, 'concluido',    100, 9.2, NOW() - INTERVAL '20 days'),
  (3, 2, 'em_andamento',  68, NULL, NULL),
  (3, 3, 'nao_iniciado',   0, NULL, NULL),
  (3, 5, 'concluido',    100, 8.5, NOW() - INTERVAL '40 days'),
  (4, 1, 'concluido',    100, 9.0, NOW() - INTERVAL '15 days'),
  (4, 2, 'concluido',    100, 8.8, NOW() - INTERVAL '10 days'),
  (5, 1, 'em_andamento',  45, NULL, NULL),
  (5, 2, 'nao_iniciado',   0, NULL, NULL),
  (6, 1, 'concluido',    100, 9.5, NOW() - INTERVAL '5 days'),
  (6, 2, 'concluido',    100, 9.1, NOW() - INTERVAL '3 days'),
  (6, 3, 'concluido',    100, 9.3, NOW() - INTERVAL '2 days')
ON CONFLICT (usuario_id, curso_id) DO NOTHING;

-- CERTIFICADOS
INSERT INTO certificados (usuario_id, curso_id, codigo, carga_horaria) VALUES
  (3, 1, 'CERT-2026-0003-0001', 8),
  (3, 5, 'CERT-2026-0003-0005', 8),
  (4, 1, 'CERT-2026-0004-0001', 8),
  (4, 2, 'CERT-2026-0004-0002', 4),
  (6, 1, 'CERT-2026-0006-0001', 8),
  (6, 2, 'CERT-2026-0006-0002', 4),
  (6, 3, 'CERT-2026-0006-0003', 6)
ON CONFLICT DO NOTHING;
