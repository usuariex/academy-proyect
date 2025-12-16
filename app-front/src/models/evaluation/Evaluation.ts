// models/evaluation.ts
export interface EvaluationRequest {
  plannedDate: string;
  description: string;
  typeId: number;
  statusId: number;
  exerciseId: number | null;
  configId: number | null;
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
  exerciseId: number | null;
  exerciseName: string | null;
  configId: number | null;
  configName: string | null;
  studentsCount: number;
  hasGradedStudents: boolean;
  totalQuestions: number | null;
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
  studentsCount: number;
  hasGradedStudents: boolean;
  totalQuestions: number | null;
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


export type StatusGradeResponse = 'Sin calificar' | 'Aprobado' | 'Desaprobado' | string;

export type StatusGrade = 'Aprobado' | 'Desaprobado' | 'Sin calificar' | 'Desconocido';






/* ============================================== */

export interface Grades {
  average: number;
  best: number;
  worst: number;
}

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



export interface EvaluationExerciseResponse {
  id: number,
  evaluation: number,
  exercise: number,
}


export interface EvaluationExercise {
  id: number,
  evaluation: number,
  exercise: number,
}