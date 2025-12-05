
import type { Student, StudentEvaluation, StudentResponse } from '@/models';

export const mapStudentsList = (data: any[]): StudentEvaluation[] =>
  data.map((item) => ({
    studentEvaluationId: item.studentEvaluationId,
    evaluationId: item.evaluationId,
    evaluationName: item.evaluationName,
    studentId: item.studentId,
    names: item.names,
    fullName: item.fullName,
    status: item.status as StudentEvaluation['status'], // tipado fuerte
    grade: item.grade ?? null,
    result: item.result ?? null,

    // campos opcionales según tipo de evaluación
    reps: item.reps ?? null,
    seconds: item.seconds ?? null,
    attempts: item.attempts ?? null,
    observations: item.observations ?? null,
  }));



/* CHECKED */
export function StudentResponseAdapter(data: StudentResponse): Student {
  return {
    id: data.id,
    firstName: data.firstName,
    lastNameFather: data.lastNameFather,
    lastNameMother: data.lastNameMother,
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
    creatAt: data.creatAt,
    uuid: data.uuid,
    code: data.code,
  };
}

