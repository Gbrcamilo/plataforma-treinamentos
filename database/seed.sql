-- ==============================================
-- SEED: Dados iniciais para desenvolvimento
-- ==============================================

-- Áreas
INSERT INTO areas (nome, descricao) VALUES
  ('Tecnologia da Informação', 'Infraestrutura, sistemas e desenvolvimento'),
  ('Recursos Humanos', 'Gestão de pessoas e desenvolvimento organizacional'),
  ('Assistência', 'Assistência médica e enfermagem'),
  ('Administrativo', 'Gestão administrativa e financeira'),
  ('Segurança do Trabalho', 'CIPA, EPI e prevenção de acidentes')
ON CONFLICT DO NOTHING;

-- Cargos
INSERT INTO cargos (nome, area_id) VALUES
  ('Analista de TI', (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação')),
  ('Gerente de TI', (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação')),
  ('Analista de RH', (SELECT id FROM areas WHERE nome = 'Recursos Humanos')),
  ('Coordenador de RH', (SELECT id FROM areas WHERE nome = 'Recursos Humanos')),
  ('Enfermeiro', (SELECT id FROM areas WHERE nome = 'Assistência')),
  ('Técnico de Enfermagem', (SELECT id FROM areas WHERE nome = 'Assistência'))
ON CONFLICT DO NOTHING;

-- Categorias de curso
INSERT INTO categorias_curso (nome, cor, icone) VALUES
  ('Onboarding', '#01696f', '🎯'),
  ('Compliance e Ética', '#006494', '⚖️'),
  ('Segurança do Trabalho', '#964219', '🦺'),
  ('Habilidades Técnicas', '#437a22', '💻'),
  ('Liderança e Gestão', '#7a39bb', '🧭'),
  ('Atendimento ao Paciente', '#a12c7b', '🏥')
ON CONFLICT DO NOTHING;

-- Usuário admin padrão (senha: Admin@123)
-- Hash gerado com bcrypt rounds=12
INSERT INTO usuarios (nome, email, senha_hash, perfil, status) VALUES
  ('Administrador', 'admin@treinamentos.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxBiOkB4Ey', 'admin', 'ativo')
ON CONFLICT (email) DO NOTHING;
