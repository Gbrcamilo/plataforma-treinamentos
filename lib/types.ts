// lib/types.ts
// Tipos compartilhados da plataforma

export type Perfil = 'admin' | 'gestor' | 'colaborador';
export type Status = 'ativo' | 'inativo' | 'suspenso';
export type StatusCurso = 'rascunho' | 'publicado' | 'arquivado';
export type StatusMatricula = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'reprovado';
export type FormatoCurso = 'video' | 'pdf' | 'scorm' | 'quiz' | 'presencial' | 'hibrido';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  status: Status;
  area_id?: string;
  cargo_id?: string;
  gestor_id?: string;
  avatar_url?: string;
  criado_em: string;
  ultimo_acesso?: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao?: string;
  categoria_id?: string;
  formato: FormatoCurso;
  carga_horaria: number;
  obrigatorio: boolean;
  status: StatusCurso;
  nota_minima: number;
  max_tentativas: number;
  validade_dias?: number;
  thumbnail_url?: string;
  criado_em: string;
}

export interface Matricula {
  id: string;
  usuario_id: string;
  curso_id: string;
  status: StatusMatricula;
  progresso: number;
  nota_final?: number;
  data_inicio?: string;
  data_conclusao?: string;
  prazo_conclusao?: string;
  certificado_emitido: boolean;
}

export interface Trilha {
  id: string;
  titulo: string;
  descricao?: string;
  obrigatoria: boolean;
  status: StatusCurso;
  thumbnail_url?: string;
  cursos?: Curso[];
}

export interface DashboardAdmin {
  total_cursos: number;
  total_usuarios: number;
  taxa_conclusao: number;
  treinamentos_vencendo: number;
  matriculas_em_andamento: number;
  matriculas_concluidas: number;
}

export interface DashboardGestor {
  total_equipe: number;
  pendencias_equipe: number;
  taxa_conclusao_equipe: number;
  vencendo_7_dias: number;
}

export interface DashboardColaborador {
  cursos_pendentes: number;
  cursos_em_andamento: number;
  cursos_concluidos: number;
  horas_treinadas: number;
  certificados: number;
  proximos_vencimentos: Matricula[];
}
