// utilities/evaluation.ts
import type { StatusGradeResponse, StatusGrade } from "@/models/evaluation";

export const classifyGradeStatus = (status: StatusGradeResponse): StatusGrade => {
    if (!status) return 'Desconocido';
    if (status === 'Sin calificar') return 'Sin calificar';
    if (status === 'Aprobado') return 'Aprobado';
    if (status === 'Desaprobado') return 'Desaprobado';
    return 'Desconocido';
};
