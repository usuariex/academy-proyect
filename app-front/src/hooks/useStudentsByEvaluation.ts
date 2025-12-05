

/* export interface StudentsPage {
  results: StudentEvaluation[];
  next: string | null;
  count: number;
}
 */


import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getStudentsByEvaluation } from '@/services';
import type { StudentEvaluation } from '@/models';

export const useStudentsByEvaluation = (
  id: number,
  enabled = true,
  page = 1,
  pageSize = 50
) => {
  return useQuery<StudentEvaluation[], Error>({
    queryKey: ['studentsByEvaluation', id, page, pageSize],
    queryFn: () => getStudentsByEvaluation(id, page, pageSize),
    enabled,
    placeholderData: keepPreviousData, // 👈 reemplazo de keepPreviousData
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // opcional: cuánto tiempo se guarda en caché
  });
};


