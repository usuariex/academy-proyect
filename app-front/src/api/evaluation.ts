import api from './axiosConfig';
import type { EvaluationTypes } from '../types/';
import type { EvaluationResponse, EvaluationRequest } from '../types';


export const getEvaluations = async (): Promise<EvaluationResponse[]> => {
  const res = await api.get('evaluaciones/'); 
  return res.data.results ?? res.data;
};


export const createEvaluation = async (data: EvaluationRequest): Promise<EvaluationResponse> => {
  const res = await api.post("evaluaciones/", data);
  return res.data;
};


export const getEvaluationTypes = async (): Promise<EvaluationTypes[]> => {
  const res = await api.get('evaluaciones/tipos/');
  return res.data; 
};




// Update student grade
export const updateStudentGrade = async (
  studentEvaluationId: number,
  newGrade: number
): Promise<void> => {
  await api.put(`students/${studentEvaluationId}/`, {
    finalGrade: newGrade,
  });
};
