import { TheoryTable } from "@evaluations/components/";
import type { StudentEvaluation } from "@/models/student";


export const TheoreticalEvaluationPanel = ({ students }: { students: StudentEvaluation[] }) => {
  return (
    <div>
      <h4>Alumnos calificados</h4>
      <TheoryTable students={students} />
    </div>
  );
};
