import api from './axiosConfig';
import {
  EvaluationAdapter,
  EvaluationSummaryAdapter,
} from '@/adapters';

import type {
  /*  StudentEvaluation, */
  EvaluationTypes,
  EvaluationResponse,
  EvaluationRequest,
  EvaluationConfigRequest,
  EvaluationConfigResponse
} from '@/models';

import type {
  EvaluationSummaryResponse,
} from '@evaluations/models';


export const getEvaluations = async (): Promise<EvaluationResponse[]> => {
  const res = await api.get('evaluations/base/');
  const data = res.data.results ?? res.data;
  return data.map(EvaluationAdapter);
};



export const getEvaluationSummary = async (
  code: string
): Promise<EvaluationSummaryResponse> => {
  const { data } = await api.get(`/evaluations/base/${code}/summary/`);
  return EvaluationSummaryAdapter(data);
};




export const createEvaluation = async (data: EvaluationRequest): Promise<EvaluationResponse> => {
  const res = await api.post("evaluations/base/", data);
  return res.data;
};





export const getEvaluationTypes = async (): Promise<EvaluationTypes[]> => {
  const res = await api.get('evaluations/types/');
  return res.data;
};



export const addConfigToEvaluation = async (data: EvaluationConfigRequest): Promise<EvaluationConfigResponse> => {
  const res = await api.post("evaluations/config/", data);
  return res.data;
};




/* ================================================================================== */



/* export const postGradeForStudent = async (studentEvaluationId: number, payload: { finalGrade: number }) => {
  const { data } = await api.post(`/students/${studentEvaluationId}/calificaciones`, payload);
  return mapStudentsList([data])[0];
};

export const putStudent = async (studentEvaluationId: number, payload: Partial<StudentEvaluation>) => {
  const { data } = await api.put(`/students/${studentEvaluationId}/`, payload);
  return mapStudentsList([data])[0];
}; */
