import { useQuery } from '@tanstack/react-query';
import { getEvaluationSummary } from '@/services';
import type { EvaluationSummaryResponse } from '@/models';

export const useEvaluationSummary = (evaluationId: number, enabled = true) => {
  return useQuery<EvaluationSummaryResponse, Error>({
    queryKey: ['evaluationSummary', evaluationId],
    queryFn: () => getEvaluationSummary(evaluationId),
    enabled,
    staleTime: 1000 * 30,
  });
};
