import type { EvaluationTypeResponse, EvaluationType, EvaluationResponse, Evaluation } from "@/models/evaluation";
import type { EvaluationSummary, EvaluationSummaryResponse } from '@evaluations/models/';




export interface Metrics {
  code: string;
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
    code: src.code,
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



export const EvaluationSummaryAdapter = (data: EvaluationSummaryResponse) => {
  const formatedResponse: EvaluationSummary = {
    code: data.code,
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
  }
  return formatedResponse
};



export const EvaluationAdapter = (data: EvaluationResponse) => {
  const formatedEvaluation: Evaluation = {
    code: data.code,
    name: data.name,
    typeId: data.typeId,
    typeName: data.typeName,
    plannedDate: data.plannedDate,
    description: data.description ?? "",
    statusId: data.statusId,
    statusName: data.statusName,
    configId: data.configId,
    configName: data.configName,
    exerciseId: data.exerciseId,
    exerciseName: data.exerciseName,
    createdAt: data.createdAt,
    studentsCount: data.studentsCount,
    hasGradedStudents: data.hasGradedStudents,
    totalQuestions: data.totalQuestions
  };
  return formatedEvaluation
}



export const EvaluationTypeAdapter = (data: EvaluationTypeResponse): EvaluationType => ({
  id: data.id,
  name: data.name,
});

