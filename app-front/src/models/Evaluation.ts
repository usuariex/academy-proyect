
export interface Evaluation {
  code: string;
  name: string;
  typeId: number;
  typeName: string;
  description: string;
  statusId: number;
  statusName: string;
  createdAt: string;
  plannedDate: string;
}

export interface EvaluationRequest {
  plannedDate: string;
  description: string;
  typeId: number;
  statusId: number;
}

export interface EvaluationResponse {
  code: string;
  name: string;
  typeId: number;
  typeName: string;
  description: string;
  statusId: number;
  statusName: string;
  createdAt: string;
  plannedDate: string;
}


export interface EvaluationTypes {
  id: number;
  name: string;
}


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