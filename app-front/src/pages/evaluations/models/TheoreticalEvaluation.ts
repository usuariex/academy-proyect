export interface TheoryEvaluationResponse {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    performedAt: string | null;
    grade: string | null;
    result: string | null;
    observations: string | null;
}

export interface TheoryEvaluationRequest {
    studentEvaluationId: number;
    result: string;
    observations?: string | null;
    performedAt?: string | null;
}

export interface TheoryEvaluation {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    performedAt: string | null;
    grade: number | null;
    result: string | null;
    observations: string | null;
}