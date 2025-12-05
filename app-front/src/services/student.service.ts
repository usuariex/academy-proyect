import api from "./axiosConfig";
import type { AxiosResponse } from "axios";
import type {
  StudentResponse,
  StudentRequest,
  StudentProfileResponse
} from "@/models";


export const getStudents = async (
  isActive?: boolean
): Promise<StudentResponse[]> => {
  try {
    const url = isActive !== undefined
      ? `alumnos/?isActive=${isActive}`
      : "alumnos/";

    const res = await api.get<StudentResponse[]>(url);
    return res.data;
  } catch (error) {
    console.error("Error al obtener estudiantes", error);
    throw error;
  }
};



export const getStudentProfile = async (uuid: string): Promise<StudentProfileResponse> => {
  try {
    const res: AxiosResponse<StudentProfileResponse> = await api.get<StudentProfileResponse>(`alumnos/perfiles/${uuid}/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener perfil del alumno", error);
    throw error;
  }
};




export async function patchStudentProfile(
  uuid: string,
  payload: Record<string, any>
): Promise<StudentProfileResponse> {
  try {
    const { data } = await api.patch<StudentProfileResponse>(`alumnos/perfiles/${uuid}/`, payload);
    return data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error; // lo relanzas para que el hook o componente lo maneje
  }
}





export const deactivateStudent = async (uuid: string): Promise<void> => {
  try {
    await api.patch(`alumnos/${uuid}/`, { isActive: false });
  } catch (error) {
    console.error("Error al desactivar estudiante", error);
    throw error;
  }
};






/* ============================================================== */

export const deleteStudent = async (uuid: string): Promise<void> => {
  await api.delete(`alumnos/${uuid}/`);
};



export async function createStudent(data: StudentRequest): Promise<StudentResponse> {
  const res = await api.post<StudentResponse>("alumnos/", data);
  return res.data;
}



/* export const getStudentsByEvaluation = async (
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
            
            */






