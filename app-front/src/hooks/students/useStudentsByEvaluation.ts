import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getStudentsByEvaluation } from '@/services';
import type { StudentsServiceResult } from '@/models';

export const useStudentsByEvaluation = (
  code: string | null,
  page = 1,
  pageSize = 20,
  enabled = true
) => {
  const queryKey = ['studentsByEvaluation', code, page, pageSize] as const;

  const options = {
    queryKey,
    queryFn: async (): Promise<StudentsServiceResult> => {
      if (!code) throw new Error('Evaluation code is required');
      return getStudentsByEvaluation(code, page, pageSize);
    },
    enabled: Boolean(code) && enabled,
    keepPreviousData: true,
    staleTime: 60_000,
  } as UseQueryOptions<
    StudentsServiceResult, // TQueryFnData
    Error,                 // TError
    StudentsServiceResult, // TData
    typeof queryKey        // TQueryKey
  >;

  return useQuery(options);
};
