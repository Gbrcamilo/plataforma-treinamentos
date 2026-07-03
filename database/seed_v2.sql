-- ============================================================
-- SEED v2 — Dados iniciais completos
-- ============================================================

-- Organização
INSERT INTO organizacoes (id, nome, cnpj) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Hospital São Lucas', '00.000.000/0001-00')
ON CONFLICT DO NOTHING;

-- Unidades
INSERT INTO unidades (id, org_id, nome, codigo) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Unidade Central', 'UC-01'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Unidade Norte', 'UN-01')
ON CONFLICT DO NOTHING;

-- Setores
INSERT INTO setores (id, unidade_id, nome, codigo) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'UTI Adulto', 'UTI-ADL'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Pronto-Socorro', 'PS-01'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Tecnologia da Informação', 'TI-01'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Recursos Humanos', 'RH-01')
ON CONFLICT DO NOTHING;

-- Cargos
INSERT INTO cargos (id, org_id, nome, nivel) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Enfermeiro', 3),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Técnico de Enfermagem', 2),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Médico', 4),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Analista de TI', 3),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Analista de RH', 3)
ON CONFLICT DO NOTHING;

-- Categorias
INSERT INTO categorias_curso (org_id, nome, cor, icone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Onboarding', '#01696f', 'target'),
  ('00000000-0000-0000-0000-000000000001', 'Compliance e Ética', '#006494', 'shield'),
  ('00000000-0000-0000-0000-000000000001', 'Segurança do Trabalho', '#964219', 'alert-triangle'),
  ('00000000-0000-0000-0000-000000000001', 'Habilidades Técnicas', '#437a22', 'cpu'),
  ('00000000-0000-0000-0000-000000000001', 'Liderança e Gestão', '#7a39bb', 'users'),
  ('00000000-0000-0000-0000-000000000001', 'Atendimento ao Paciente', '#a12c7b', 'heart'),
  ('00000000-0000-0000-0000-000000000001', 'LGPD e Privacidade', '#006494', 'lock'),
  ('00000000-0000-0000-0000-000000000001', 'Protocolos Clínicos', '#964219', 'clipboard')
ON CONFLICT DO NOTHING;

-- Usuários (senha: Admin@123 para admin, Gestor@123 para gestor, Colab@123 para colaborador)
-- Hashes gerados com bcrypt rounds=12
INSERT INTO usuarios (id, org_id, unidade_id, setor_id, cargo_id, nome, email, senha_hash, perfil, status) VALUES
  ('40000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001', NULL, NULL,
   'Administrador Sistema', 'admin@hospital.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxBiOkB4Ey',
   'admin', 'ativo'),
  ('40000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000001', NULL,
   'Gestora UTI', 'gestor@hospital.com',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   'gestor', 'ativo'),
  ('40000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   'Maria Silva', 'colaborador@hospital.com',
   '$2a$12$2IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   'colaborador', 'ativo')
ON CONFLICT (email) DO NOTHING;

-- Gestor da Maria
UPDATE usuarios SET gestor_id = '40000000-0000-0000-0000-000000000002'
WHERE id = '40000000-0000-0000-0000-000000000003';
