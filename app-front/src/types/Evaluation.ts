

export interface EvaluationRequest {
  plannedDate: string | null;
  description: string | null;
  typeId: number;
  statusId: number ;
}

export interface EvaluationResponse {
  id: number;
  typeId: number;
  typeName: string; 
  plannedDate: string;
  description: string;
  statusId: number;
  statusName: string;
  createdAt: string;
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