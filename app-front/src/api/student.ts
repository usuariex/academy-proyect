import api from "./axiosConfig";
import type { StudentEvaluation, StudentResponse, StudentRequest,StudentProfileResponse } from "../types/";


export const getAllStudents = async (): Promise<StudentResponse[]> => {
  try {
    const res = await api.get<StudentResponse[]>("alumnos/");
    return res.data;
  } catch (error) {
    console.error("Error al obtener estudiantes", error);
    throw error;
  }
};


export const getStudentProfile = async (id: number): Promise<StudentProfileResponse> => {
  try {
    const res = await api.get<StudentProfileResponse>(`alumnos/perfiles/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener perfil del alumno", error);
    throw error;
  }
};




export const getStudentsByEvaluation = async (
  evaluationId: number,
  page: number = 1,
  limit: number = 100
): Promise<{ results: StudentEvaluation[]; next: string | null }> => {
  const res = await api.get(
    `evaluaciones/alumnos/?evaluationId=${evaluationId}&page=${page}&limit=${limit}`
  );
  return { results: res.data.results, next: res.data.next };
};




export const searchStudentsByEvaluation = async (
  evaluationId: number,
  search: string,
  filter: string
): Promise<StudentEvaluation[]> => {
  const res = await api.get(
    `evaluaciones/alumnos/?evaluationId=${evaluationId}&search=${search}&filter=${filter}&page=1&limit=100`
  );
  return res.data.results
};



export async function createStudent(data: StudentRequest): Promise<StudentResponse> {
  const res = await api.post<StudentResponse>("alumnos/", data);
  return res.data;
}