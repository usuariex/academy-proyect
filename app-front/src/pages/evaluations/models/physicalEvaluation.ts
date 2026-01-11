

export interface PhysicalEvaluationResponse {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    grade: string | null;
    result: string | null;
    performedAt: string | null;
    observations: string | null;
}

export interface PhysicalEvaluationRequest {
    studentEvaluationId: number;
    result?: number;
    observations?: string | null;
    performedAt?: string | null;
}

export interface PhysicalEvaluation {
    id: number;
    studentEvaluationId: number;
    evaluationId: number;
    grade: number | null;
    result: string | null;
    performedAt: string | null;
    observations: string | null;
}