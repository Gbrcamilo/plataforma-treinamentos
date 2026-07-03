import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(4, 'Senha deve ter ao menos 4 caracteres'),
})

export const UsuarioCreateSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  perfil: z.enum(['admin', 'gestor', 'colaborador']),
  cargo: z.string().optional(),
  setor_id: z.number().optional(),
})

export const UsuarioUpdateSchema = UsuarioCreateSchema.partial().omit({ senha: true })

export const CursoSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
  categoria: z.string(),
  carga_horaria: z.number().min(1),
  obrigatorio: z.boolean().default(false),
  prazo_dias: z.number().optional(),
  ativo: z.boolean().default(true),
})

export const TrilhaSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
  obrigatorio: z.boolean().default(false),
  prazo_dias: z.number().optional(),
  curso_ids: z.array(z.number()).min(1),
})

export const ProgressoSchema = z.object({
  curso_id: z.number(),
  usuario_id: z.number().optional(),
  status: z.enum(['nao_iniciado', 'em_andamento', 'concluido']),
  progresso_pct: z.number().min(0).max(100),
  nota: z.number().min(0).max(10).optional(),
})
