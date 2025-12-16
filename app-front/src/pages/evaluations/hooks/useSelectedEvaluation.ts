import { SelectedEvaluationContext } from "@/contexts";
import { useContext } from "react";

export const useSelectedEvaluation = () => {
    const ctx = useContext(SelectedEvaluationContext);
    if (!ctx) throw new Error("useSelectedEvaluation must be used inside SelectedEvaluationProvider");
    return ctx;
};