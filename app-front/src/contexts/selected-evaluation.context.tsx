
import { createContext } from "react";
import type { ReactNode } from "react";
import type { Evaluation } from "@/models/evaluation";

interface SelectedEvaluationContextValue {
  selectedEvaluation: Evaluation | null;
}

export const SelectedEvaluationContext = createContext<SelectedEvaluationContextValue | null>(null);

export const SelectedEvaluationProvider = ({
  children,
  selectedEvaluation,
}: {
  children: ReactNode;
  selectedEvaluation: Evaluation | null;
}) => (
  <SelectedEvaluationContext.Provider value={{ selectedEvaluation }}>
    {children}
  </SelectedEvaluationContext.Provider>
);

