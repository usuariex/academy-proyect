
import type { Student, StudentEvaluation, StudentEvaluationResponse, StudentResponse } from '@/models';

/* export const mapStudentsList = (data: any[]): StudentEvaluation[] =>
  data.map((item) => ({
    studentEvaluationId: item.studentEvaluationId,
    evaluationId: item.evaluationId,
    evaluationName: item.evaluationName,
    studentId: item.studentId,
    names: item.names,
    fullName: item.fullName,
    status: item.status as StudentGradeStatus,
    grade: item.grade ?? null,
    result: item.result ?? null,

    // campos opcionales según tipo de evaluación
    reps: item.reps ?? null,
    seconds: item.seconds ?? null,
    attempts: item.attempts ?? null,
    observations: item.observations ?? null,
  }));
 */






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







export const mapRaw = (raw: StudentEvaluationResponse): StudentEvaluationResponse => {
  return raw;
};

export const mapStudent = (raw: StudentEvaluationResponse): StudentEvaluation => {
  return {
    studentUuid: typeof raw.studentUuid === 'string' ? raw.studentUuid : '',
    studentFullName: typeof raw.studentFullName === 'string' ? raw.studentFullName : '',
    grade: raw.grade ?? null,
    result: raw.result ?? null,
    observations: raw.observations ?? null,
    exerciseName: raw.exerciseName ?? null,
    theoryPerformedAt: raw.theoryPerformedAt ?? null,
    theoryAttemptNumber: raw.theoryAttemptNumber ?? null,
    status: raw.status ?? null,
  };
};

export const StudentsEvaluationAdapter = (data: StudentEvaluationResponse[] = []): StudentEvaluation[] =>
  data.map(mapStudent);