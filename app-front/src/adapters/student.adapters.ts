
import type { PaginatedResponse, StudentsServiceResult, Student, StudentEvaluation, StudentEvaluationResponse, StudentResponse } from '@/models/student';


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






export const mapRaw = (raw: StudentEvaluationResponse): StudentEvaluationResponse => raw;

export const mapStudent = (raw: StudentEvaluationResponse): StudentEvaluation => {
  const exercise = raw.assigned_exercise ?? null;
  const config = raw.assigned_config ?? null;

  return {
    studentEvaluationId: raw.studentEvaluationId,
    studentUuid: typeof raw.studentUuid === "string" ? raw.studentUuid : "",
    studentFullName: typeof raw.studentFullName === "string" ? raw.studentFullName : "",
    grade: raw.grade ?? null,
    result: raw.result ?? null,
    performedAt: raw.performedAt ?? null,
    observations: raw.observations ?? null,
    status: raw.status ?? null,

    exerciseId: exercise && typeof exercise.id === "number" ? exercise.id : null,
    exerciseName: exercise && typeof exercise.name === "string" ? exercise.name : null,

    configId: config && typeof config.id === "number" ? config.id : null,
    configName: config && typeof config.name === "string" ? config.name : null,
  };
};

export const StudentsEvaluationAdapter = (data: StudentEvaluationResponse[] = []): StudentEvaluation[] =>
  data.map(mapStudent);


export const adaptPaginated = (raw: PaginatedResponse): StudentsServiceResult => ({
  raw,
  items: (raw.results ?? []).map(mapStudent),
});
