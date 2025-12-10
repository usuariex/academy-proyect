// models/evaluation.ts
export interface EvaluationRequest {
  plannedDate: string;
  description: string;
  typeId: number;
  statusId: number;
  // opcionalmente: exerciseId | configId (no lo incluimos aquí para mantener el request base)
  exerciseId?: number;
  configId?: number;
}

export interface EvaluationResponse {
  code: string;
  name: string;
  description: string;
  typeId: number;
  typeName: string;
  statusId: number;
  statusName: string;
  createdAt: string;
  plannedDate: string;
  exerciseId_read?: number | null;
  exerciseName?: string | null;
  configId_read?: number | null;
  configName?: string | null;
}

export interface Evaluation {
  code: string;
  name: string;
  description: string;
  typeId: number;
  typeName: string;
  statusId: number;
  statusName: string;
  createdAt: string;
  plannedDate: string;
  exerciseId?: number | null;
  exerciseName?: string | null;
  configId?: number | null;
  configName?: string | null;
}


/* Tipos de evaluacion */

export interface EvaluationTypeResponse {
  id: number;
  name: string;
}

export interface EvaluationType {
  id: number;
  name: string;
}


/* Configuracion o ejercicio asignado a evaluacion */

export interface EvaluationConfigResponse {
  id: number;
  name: string;
}
export interface EvaluationExerciseResponse {
  id: number;
  name: string;
}

/* export interface EvaluationConfig {
  id: number;
  name: string;
}


export interface EvaluationExercise {
  id: number;
  name: string;
}


 */







export interface Grades {
  average: number;
  best: number;
  worst: number;
}



export type StatusGradeResponse = 'Sin calificar' | 'Aprobado' | 'Desaprobado' | string;
export type StatusGrade = 'approved' | 'failed' | 'ungraded' | 'unknown';










/* ============================================== */


/* Añadir configuacion a evaluaciones teoricas */

export interface EvaluationConfigRequest {
  evaluationId: number;
  configId: number;
}

export interface EvaluationConfigResponse {
  id: number;
  evaluationId: number;
  configId: number;
}