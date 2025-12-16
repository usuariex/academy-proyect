import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getStudentsByEvaluation } from '@/services/student';
import type { StudentsByEvaluation } from '@/models/student';


export const useStudentsByEvaluation = (
  code: string | null,
  page = 1,
  pageSize = 20,
  enabled = true
) => {
  const queryKey = ["studentsByEvaluation", code, page, pageSize] as const;

  const options = {
    queryKey,
    queryFn: async (): Promise<StudentsByEvaluation> => {
      if (!code) throw new Error("Evaluation code is required");
      return getStudentsByEvaluation(code, page, pageSize);
    },
    enabled: Boolean(code) && enabled, // solo ejecuta si hay código
    keepPreviousData: true,            // mantiene datos previos al cambiar de página
    staleTime: 60_000,                  // cache válido por 1 minuto
  } as UseQueryOptions<
    StudentsByEvaluation,
    Error,
    StudentsByEvaluation,
    typeof queryKey
  >;

  return useQuery(options);
};
