

export interface EvaluationRequest {
  plannedDate: string | null;
  description: string | null;
  typeId: number;
  statusId: number ;
}

export interface EvaluationResponse {
  id: number;
  evalCode: string;
  name: string;
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



/* ============================================== */


export interface EvaluationSummaryResponse {
  evaluationId: number;
  evaluationName: string;
  evaluationType: string;
  plannedDate: string;
  statusName: string;
  totalStudents: number;
  approved: number;
  failed: number;
  ungraded: number;
  averageGrade: number | null;
  maxGrade: number | null;
  minGrade: number | null;
  medianGrade: number | null;
  gradeDistribution: {
    '0-10': number;
    '11-15': number;
    '16-20': number;
  };
  statusDistribution: {
    approved: number;
    failed: number;
    ungraded: number;
  };
}
