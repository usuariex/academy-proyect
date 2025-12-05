export interface EvaluationConfigRequest {
  evaluationId: number;
  configId: number;
}

export interface EvaluationConfigResponse {
  id: number;
  evaluationId: number;
  configId: number;
}