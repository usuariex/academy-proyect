import api from './axiosConfig';
import type { EvaluationTypes } from '../models';
import type { EvaluationResponse, EvaluationRequest } from '../models';
import type { EvaluationSummaryResponse } from '@/models';
import { mapStudentsList } from '@/adapters/student.adapters';
import { EvaluationResponseAdapter, mapEvaluationSummaryResponse } from '@/adapters/evaluation.adapters';
import type { StudentEvaluation } from '@/models';



/* CHECKED */
export const getEvaluations = async (): Promise<EvaluationResponse[]> => {
  const res = await api.get('evaluaciones/');
  const data = res.data.results ?? res.data;
  return data.map(EvaluationResponseAdapter);
};



/*
// Update student grade
export const updateStudentGrade = async (
  studentEvaluationId: number,
  newGrade: number
): Promise<void> => {
  await api.put(`students/${studentEvaluationId}/`, {
    finalGrade: newGrade,
  });
};
 */

export const createEvaluation = async (data: EvaluationRequest): Promise<EvaluationResponse> => {
  const res = await api.post("evaluaciones/", data);
  return res.data;
};



export const getEvaluationTypes = async (): Promise<EvaluationTypes[]> => {
  const res = await api.get('evaluaciones/tipos/');
  return res.data;
};







export const getStudentsByEvaluation = async (
  evaluationId: number,
  page = 1,
  pageSize = 20
): Promise<StudentEvaluation[]> => {
  const { data } = await api.get(`/evaluaciones/alumnos/admin/`, {
    params: { evaluationId, page, page_size: pageSize },
  });
  // tu backend devuelve un array directo
  return mapStudentsList(data);
};








export const searchStudentsByEvaluation = async (evalCode: string, q: string, filter?: string) => {
  const { data } = await api.get(`/evaluaciones/alumnos/`, {
    params: { evaluationId: evalCode, q, filter },
  });
  return mapStudentsList(data.results ?? data);
};

export const postGradeForStudent = async (studentEvaluationId: number, payload: { finalGrade: number }) => {
  const { data } = await api.post(`/alumnos/${studentEvaluationId}/calificaciones`, payload);
  return mapStudentsList([data])[0];
};

export const putStudent = async (studentEvaluationId: number, payload: Partial<StudentEvaluation>) => {
  const { data } = await api.put(`/students/${studentEvaluationId}/`, payload);
  return mapStudentsList([data])[0];
};















































export const getEvaluationSummary = async (
  evaluationId: number
): Promise<EvaluationSummaryResponse> => {
  const { data } = await api.get(`/evaluaciones/${evaluationId}/resumen/`);
  return mapEvaluationSummaryResponse(data);
};