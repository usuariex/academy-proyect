import { api } from "@/services";
import type { AxiosResponse } from "axios";
import type {
  StudentResponse,
  StudentRequest,
  StudentProfileResponse,
  Student,
  StudentEvaluation,
  StudentsByEvaluation,
  StudentsByEvaluationResponse
} from "@/models/student";
import { mapAvailableStudent, StudentsEvaluationAdapter } from "@/adapters";


export const getStudents = async (
  isActive?: boolean
): Promise<StudentResponse[]> => {
  try {
    const url = isActive !== undefined
      ? `students/?isActive=${isActive}`
      : "students/";

    const res = await api.get<StudentResponse[]>(url);
    return res.data;
  } catch (error) {
    console.error("Error al obtener estudiantes", error);
    throw error;
  }
};




export const getStudentsByEvaluation = async (
  code: string,
  page = 1,
  pageSize = 20
): Promise<StudentsByEvaluation> => {
  const url = `/evaluations/${encodeURIComponent(code)}/students/`;

  // Tipamos la respuesta cruda con StudentsByEvaluationResponse
  const { data } = await api.get<StudentsByEvaluationResponse>(url, {
    params: { page, page_size: pageSize },
  });

  // Adaptamos asignados y disponibles
  const assigned: StudentEvaluation[] = StudentsEvaluationAdapter(data.assigned);
  const available: Student[] = data.available.map(mapAvailableStudent);

  return {
    assigned,
    available,
    pagination: data.pagination,
  };
};







export const getStudentProfile = async (uuid: string): Promise<StudentProfileResponse> => {
  try {
    const res: AxiosResponse<StudentProfileResponse> = await api.get<StudentProfileResponse>(`students/profiles/${uuid}/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener perfil del alumno", error);
    throw error;
  }
};

export async function createStudent(data: StudentRequest): Promise<StudentResponse> {
  const res = await api.post<StudentResponse>("students/", data);
  return res.data;
}






export const deactivateStudent = async (uuid: string): Promise<void> => {
  try {
    await api.patch(`students/${uuid}/`, { isActive: false });
  } catch (error) {
    console.error("Error al desactivar estudiante", error);
    throw error;
  }
};



export const deleteStudent = async (uuid: string): Promise<void> => {
  await api.delete(`students/${uuid}/`);
};



/* ============================================================== */




export async function patchStudentProfile(
  uuid: string,
  payload: Record<string, any>
): Promise<StudentProfileResponse> {
  try {
    const { data } = await api.patch<StudentProfileResponse>(`students/profiles/${uuid}/`, payload);
    return data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error; // lo relanzas para que el hook o componente lo maneje
  }
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



