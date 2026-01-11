
import type { StudentEvaluation } from '@/models/student';
import { PhysicalTable } from '@evaluations/components/';
/* import styles from './PhysicalEvaluationPanel.module.css'; */

interface Props {
  students: StudentEvaluation[];
  evalCode: string;
  onOpenEdit?: (student: StudentEvaluation) => void;
}

export const PhysicalEvaluationPanel: React.FC<Props> = ({ students }) => {

  return (
    <div>
      <h4>Alumnos calificados</h4>
      <PhysicalTable students={students} />
    </div>
  );
};

