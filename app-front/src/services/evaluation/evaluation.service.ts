
import { AssignStudentsAdapter, evaluationStatusAdapter } from "@/adapters/evaluation";
import { api } from "@/services";
import {
  EvaluationAdapter,
  EvaluationSummaryAdapter,
  EvaluationTypeAdapter,
} from '@/adapters';

import type {
  Evaluation,
  EvaluationTypeResponse,
  EvaluationType,
  EvaluationResponse,
  EvaluationRequest,
  EvaluationConfigRequest,
  EvaluationConfigResponse,
} from '@/models/evaluation';

import type {
  EvaluationSummaryResponse,
  evaluationStatusResponse,
  evaluationStatus,
  AssignStudentsRequest,
  AssignStudents,
  AssignStudentsResponse,
  RemoveStudentsRequest
} from '@evaluations/models';


export const getEvaluations = async (): Promise<EvaluationResponse[]> => {
  const res = await api.get('evaluations/');
  const data = res.data.results ?? res.data;
  return data.map(EvaluationAdapter);
};



export const getEvaluationSummary = async (
  code: string
): Promise<EvaluationSummaryResponse> => {
  const { data } = await api.get(`/evaluations/${code}/summary/`);
  return EvaluationSummaryAdapter(data);
};



export const createEvaluation = async (data: EvaluationRequest): Promise<Evaluation> => {
  const res = await api.post<EvaluationResponse>("evaluations/", data);
  const raw = res.data;
  return EvaluationAdapter(raw);
};





export const updateEvaluation = async (
  code: string,
  payload: Partial<EvaluationRequest>
): Promise<Evaluation> => {
  try {
    const res = await api.patch(`evaluations/${code}/`, payload);
    return EvaluationAdapter(res.data);
  } catch (err: any) {
    console.error("Error PATCH:", err.response?.data);
    throw err;
  }

};


export const deleteEvaluation = async (code: string): Promise<void> => {
  await api.delete(`evaluations/${code}/`);
};



//fuera de funcionamiento kiza
export const updateEvaluationStatus = async (
  code: string,
  statusId: number
): Promise<Evaluation> => {
  const res = await api.put(`evaluations/${code}/status/`, { statusId });
  return EvaluationAdapter(res.data);
};











export const getEvaluationTypes = async (): Promise<EvaluationType[]> => {
  const res = await api.get<EvaluationTypeResponse[]>("evaluations/types/");
  const data = res.data;
  return data.map(EvaluationTypeAdapter);
};



export const addConfigToEvaluation = async (data: EvaluationConfigRequest): Promise<EvaluationConfigResponse> => {
  const res = await api.post("evaluations/config/", data);
  return res.data;
};




export const getEvaluationStatus = async (): Promise<evaluationStatus[]> => {
  const res = await api.get("evaluations/status/");
  const data: evaluationStatusResponse[] = res.data.results ?? res.data;
  return data.map(evaluationStatusAdapter);
};








// aun por usar
export const assignStudentsToEvaluation = async (
  code: string,
  payload: AssignStudentsRequest
): Promise<AssignStudents> => {
  const { data } = await api.post<AssignStudentsResponse>(
    `/evaluations/${code}/assign-students/`,
    payload
  );
  return AssignStudentsAdapter(data);
};


export const removeStudentsFromEvaluation = async (code: string, payload: RemoveStudentsRequest) => {
  const { data } = await api.post(`/evaluations/${code}/remove-students/`, payload);
  return data;
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
