export interface TheoryEvaluationResponse {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    performedAt: string | null;
    grade: string | null;   // viene como string
    result: number | null;
    observations: string | null;
}

export interface TheoryEvaluationRequest {
    studentEvaluationId: number;
    result: number;
    observations?: string | null;
    performedAt?: string | null;
}

export interface TheoryEvaluation {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    performedAt: string | null;
    grade: number | null;        // normalizado a number
    result: number | null;
    observations: string | null;
}