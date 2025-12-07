/* // src/utils/studentStatus.ts
export type StatusGradeResponse = 'Sin calificar' | 'Aprobado' | 'Desaprobado' | string;

export type StatusGrade = 'approved' | 'failed' | 'ungraded' | 'unknown';

export const normalizeResult = (status: StatusGradeResponse): StatusGrade => {
    if (!status) return 'unknown';
    if (status === 'Sin calificar') return 'ungraded';
    if (status === 'Aprobado') return 'approved';
    if (status === 'Desaprobado') return 'failed';
    return 'unknown';
};











import React, { useMemo, useState } from 'react';
import { useStudentsByEvaluation } from '@/hooks/useStudentsByEvaluation';
import { classifyGradeStatus, StatusGrade } from '@/utils/studentStatus';
import type { StudentEvaluation } from '@/models';

export function StudentsPage({ evaluationCode }: { evaluationCode: string }) {
    const { data, isLoading: studentsLoading, error: studentsError } =
        useStudentsByEvaluation(evaluationCode, 1, 20);

    const students = data?.items ?? [];

    // Select states
    const [resultFilter, setResultFilter] = useState<'all' | StatusGrade>('all');
    const [gradedFilter, setGradedFilter] = useState<'all' | 'graded' | 'not_graded'>('all');
    const [search, setSearch] = useState('');

     // Filtrado memoizado
     const filteredStudents = useMemo(() => {
         return students.filter((s: StudentEvaluation) => {
             const normalized = classifyGradeStatus(s.status ?? (s.grade == null ? 'Sin calificar' : 'Desaprobado'));
 
             // Resultado (approved/failed/ungraded)
             if (resultFilter !== 'all' && normalized !== resultFilter) return false;
 
             // Calificado / Sin calificar
             const isGraded = s.grade !== null && s.grade !== undefined;
             if (gradedFilter === 'graded' && !isGraded) return false;
             if (gradedFilter === 'not_graded' && isGraded) return false;
 
             // Búsqueda por nombre o uuid (opcional)
             if (search.trim()) {
                 const q = search.trim().toLowerCase();
                 const name = (s.studentFullName ?? '').toLowerCase();
                 const uuid = (s.studentUuid ?? '').toLowerCase();
                 if (!name.includes(q) && !uuid.includes(q)) return false;
             }
 
             return true;
         });
     }, [students, resultFilter, gradedFilter, search]);




    if (studentsLoading) return <div>Cargando alumnos...</div>;
    if (studentsError) return <div style={{ color: 'red' }}>Error: {studentsError.message}</div>;

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select value={resultFilter} onChange={e => setResultFilter(e.target.value as any)}>
                    <option value="all">Todos los resultados</option>
                    <option value="approved">Aprobado</option>
                    <option value="failed">Desaprobado</option>
                    <option value="ungraded">Sin calificar</option>
                </select>

                <select value={gradedFilter} onChange={e => setGradedFilter(e.target.value as any)}>
                    <option value="all">Todos</option>
                    <option value="graded">Calificado</option>
                    <option value="not_graded">Sin calificar</option>
                </select>

                <input
                    placeholder="Buscar por nombre o UUID"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <StudentsTable students={filteredStudents} onOpenEdit={handleOpenEdit} />
        </div>
    );
}
 */