export interface PhysicalSessionRequest {
  evaluationId: number;
  realizationDate: string;
  place: string;
}

export interface PhysicalSessionResponse {
  id: number;
  evaluationId: number;
  realizationDate: string;
  place: string;
}