
import type { Student, StudentEvaluation, StudentEvaluationResponse, StudentResponse } from '@/models/student';


/* CHECKED */
export function StudentResponseAdapter(data: StudentResponse): Student {
  return {
    id: data.id,
    firstName: data.firstName,
    lastNameFather: data.paternalSurname,
    lastNameMother: data.maternalSurname,
    fullName: data.fullName,
    birthDate: data.birthDate,
    email: data.email ?? "",
    phone: data.phone ?? "",
    statusId: data.statusId,
    statusName: data.statusName,
    genderId: data.genderId,
    genderName: data.genderName,
    weight: data.weight,
    height: data.height,
    dni: data.dni ?? "",
    isActive: data.isActive,
    createdAt: data.createdAt,
    uuid: data.uuid,
    code: data.code,
  };
}



export const mapStudentEvaluation = (
  raw: StudentEvaluationResponse
): StudentEvaluation => {
  return {
    studentEvaluationId: raw.studentEvaluationId,
    studentUuid: typeof raw.studentUuid === "string" ? raw.studentUuid : "",
    studentFullName: typeof raw.studentFullName === "string" ? raw.studentFullName : "",
    grade: raw.grade ?? null,
    result: raw.result ?? null,
    performedAt: raw.performedAt ?? null,
    observations: raw.observations ?? null,
    status: raw.status ?? null,

    // Adaptar ejercicio asignado
    exerciseId:
      raw.assigned_exercise && typeof raw.assigned_exercise.id === "number"
        ? raw.assigned_exercise.id
        : null,
    exerciseName:
      raw.assigned_exercise && typeof raw.assigned_exercise.name === "string"
        ? raw.assigned_exercise.name
        : null,

    // Adaptar configuración asignada
    configId:
      raw.assigned_config && typeof raw.assigned_config.id === "number"
        ? raw.assigned_config.id
        : null,
    configName:
      raw.assigned_config && typeof raw.assigned_config.name === "string"
        ? raw.assigned_config.name
        : null,
  };
};

export const StudentsEvaluationAdapter = (
  data: StudentEvaluationResponse[] = []
): StudentEvaluation[] => data.map(mapStudentEvaluation);


export const mapAvailableStudent = (raw: StudentResponse): Student => {
  return {
    id: raw.id,
    uuid: raw.uuid,
    code: raw.code,
    firstName: raw.firstName,
    lastNameFather: raw.paternalSurname,
    lastNameMother: raw.maternalSurname,
    fullName: raw.fullName,
    birthDate: raw.birthDate,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    statusId: raw.statusId,
    statusName: raw.statusName,
    genderId: raw.genderId,
    genderName: raw.genderName,
    weight: raw.weight ?? null,
    height: raw.height ?? null,
    dni: raw.dni,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
  };
};