
import type { EvaluationSummaryResponse, EvaluationResponse } from '@/models/';



/* onserbada kiza fuera de uso */
export interface Metrics {
  evaluationId: number;
  name: string;
  type: string;
  plannedDate: string | null;
  status: string;
  total: number;
  approved: number;
  failed: number;
  ungraded: number;
  average: number | null;
  max: number | null;
  min: number | null;
  median: number | null;
  gradeDistribution: { label: string; count: number }[];
  statusDistribution: { label: string; percent: number }[];
}

/**
 * Mapea la respuesta del backend al formato que consume MetricsPanel.
 */
export const mapSummaryToMetrics = (src: EvaluationSummaryResponse): Metrics => {
  const gradeDistribution = Object.entries(src.gradeDistribution).map(([label, count]) => ({
    label,
    count,
  }));

  const statusDistribution = Object.entries(src.statusDistribution).map(([key, percent]) => ({
    label: key,
    percent,
  }));

  return {
    evaluationId: src.evaluationId,
    name: src.evaluationName,
    type: src.evaluationType,
    plannedDate: src.plannedDate,
    status: src.statusName,
    total: src.totalStudents,
    approved: src.approved,
    failed: src.failed,
    ungraded: src.ungraded,
    average: src.averageGrade,
    max: src.maxGrade,
    min: src.minGrade,
    median: src.medianGrade,
    gradeDistribution,
    statusDistribution,
  };
};



export const mapEvaluationSummaryResponse = (data: any): EvaluationSummaryResponse => ({
  evaluationId: data.evaluationId,
  evaluationName: data.evaluationName,
  evaluationType: data.evaluationType,
  plannedDate: data.plannedDate,
  statusName: data.statusName,
  totalStudents: data.totalStudents,
  approved: data.approved,
  failed: data.failed,
  ungraded: data.ungraded,
  averageGrade: data.averageGrade,
  maxGrade: data.maxGrade,
  minGrade: data.minGrade,
  medianGrade: data.medianGrade,
  gradeDistribution: data.gradeDistribution,
  statusDistribution: data.statusDistribution,
});



/* CHECKED */
export function EvaluationResponseAdapter(item: any): EvaluationResponse {
  return {
    id: item.id,
    evalCode: item.code,
    name: item.name,
    typeId: item.typeId,
    typeName: item.typeName,
    plannedDate: item.plannedDate,
    description: item.description ?? "",
    statusId: item.statusId,
    statusName: item.statusName,
    createdAt: item.createdAt,
  };
}