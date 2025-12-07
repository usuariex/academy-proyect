import type { StatusGradeResponse, StatusGrade } from "@/models";

export const classifyGradeStatus = (status: StatusGradeResponse): StatusGrade => {
    if (!status) return 'unknown';
    if (status === 'Sin calificar') return 'ungraded';
    if (status === 'Aprobado') return 'approved';
    if (status === 'Desaprobado') return 'failed';
    return 'unknown';
};