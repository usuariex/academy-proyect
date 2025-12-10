import { useQuery } from '@tanstack/react-query';
import { getEvaluationSummary } from '@/services/evaluation';
import type { EvaluationSummaryResponse } from '@evaluations/models';

export const useEvaluationSummary = (evaluationId: string, enabled = true) => {
  return useQuery<EvaluationSummaryResponse, Error>({
    queryKey: ['evaluationSummary', evaluationId],
    queryFn: () => getEvaluationSummary(evaluationId),
    enabled,
    staleTime: 1000 * 30,
  });
};
