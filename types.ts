
export enum AppSection {
  HOME = 'EL CAMINO',
  MAPA = 'MI MAPA',
  MENTOR = 'MENTOR',
  HERRAMIENTAS = 'ACCIONES',
  RACHA = 'HISTORIAL',
  RECURSOS = 'RECURSOS'
}

export enum OnboardingStep {
  CONTRACT = 'CONTRACT',
  AUTH = 'AUTH',
  QUIZ = 'QUIZ',
  PROFILE = 'PROFILE',
  COMPLETED = 'COMPLETED'
}

export interface Pilar {
  id: number;
  titulo: string;
  subtitulo: string;
  concepto: string;
  accion: string;
  ejercicio: string;
  completado: boolean;
  bloqueado: boolean;
}

export interface UserStats {
  current_streak: number;
  best_streak: number;
  last_active_date: string | null;
  total_milestones: number;
  xp: number;
}

export interface DailySpark {
  day_id: number;
  quote: string;
  author?: string;
  action_task: string;
  is_completed: boolean;
}

export interface Confession {
  id: string;
  content: string; // Base64 local data
  type: 'text' | 'voice' | 'video';
  timestamp: string;
  date: string; // YYYY-MM-DD
  pilarId: number;
  sessionName?: string; // Protocolo RMC_Session_[Fecha]_[Tema]
  note?: string; // Etiqueta emocional o nota de reflexión
}

export interface ActivityLog {
  log_date: string;
  tasks_completed: number;
  day_name: string;
}

export interface SubTask {
  task_name: string;
  is_done: boolean;
}

export interface Goal {
  id: string;
  goal_title: string;
  target_date: string;
  sub_tasks: SubTask[];
  progress_percentage: number;
}

export interface UserIdentity {
  name?: string;
  dob?: string;
  profession?: string;
  email?: string;
  deviceId?: string;
  north_star: string;
  current_identity: string;
  new_identity: string;
  blocker_reason?: string;
  is_verified?: boolean;
}
