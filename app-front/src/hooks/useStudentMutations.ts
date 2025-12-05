// src/hooks/useStudentMutations.ts
import { useMutation, useQueryClient, type MutationFunction, type UseMutationOptions } from '@tanstack/react-query';
import { postGradeForStudent, putStudent } from '@/services';
import type { StudentEvaluation } from '@/models';

type GradeVariables = { studentEvaluationId: number; finalGrade: number };
type EditVariables = { studentEvaluationId: number; payload: Partial<StudentEvaluation> };

export const useStudentMutations = (evalCode?: string) => {
  const qc = useQueryClient();

  const gradeFn: MutationFunction<StudentEvaluation, GradeVariables> = async (vars) =>
    postGradeForStudent(vars.studentEvaluationId, { finalGrade: vars.finalGrade });

  const gradeOptions: UseMutationOptions<StudentEvaluation, Error, GradeVariables, unknown> = {
    mutationFn: gradeFn,
    onSuccess: () => {
      if (evalCode) qc.invalidateQueries({ queryKey: ['studentsByEvaluation', evalCode] });
      qc.invalidateQueries({ queryKey: ['evaluationSummary', evalCode] });
    },
  };

  const gradeMutation = useMutation<StudentEvaluation, Error, GradeVariables, unknown>(gradeOptions);

  const editFn: MutationFunction<StudentEvaluation, EditVariables> = async (vars) =>
    putStudent(vars.studentEvaluationId, vars.payload);

  const editOptions: UseMutationOptions<StudentEvaluation, Error, EditVariables, unknown> = {
    mutationFn: editFn,
    onSuccess: () => {
      if (evalCode) qc.invalidateQueries({ queryKey: ['studentsByEvaluation', evalCode] });
      qc.invalidateQueries({ queryKey: ['evaluationSummary', evalCode] });
    },
  };

  const editMutation = useMutation<StudentEvaluation, Error, EditVariables, unknown>(editOptions);

  return { gradeMutation, editMutation };
};
