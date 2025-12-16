
import type { StudentEvaluation } from '@/models/student';
import styles from './StudentsByEvaluationTable.module.css';
import type { Column } from '@/models/ui';
import { DataTable, DataTableRow } from '@/components/data-display';


interface Props {
  students: StudentEvaluation[];
  onOpenEdit: (student: StudentEvaluation) => void;
}

export const StudentsByEvaluationTable = ({ students }: Props) => {

  const Exercise = students.find(s => typeof s.exerciseName === 'string' && s.exerciseName.trim() !== '')?.exerciseName ?? null;

  const columns: Column<StudentEvaluation>[] = [
    { key: "studentFullName", label: "Alumno", render: (value) => value },
    {
      key: "status", label: "Estado",
      render: (value) => (
        <span
          className={`${styles.status} ${value === "Aprobado" ? styles.aprobado :
            value === "Desaprobado" ? styles.desaprobado :
              value === "Sin calificar" ? styles.sinCalificar :
                styles.calificado
            }`}
        >
          {value}
        </span>
      )
    },
    { key: "grade", label: "Calificación ", render: (value) => value ?? "-" },
    { key: "result", label: `${Exercise ?? "Respuestas correctas"}`, render: (value) => value ?? "-" },
    { key: "observations", label: "Observaciones", render: (value) => value ?? "-" },
  ];



  return (
    <div className={styles.tableWrapper}>

      <DataTable<StudentEvaluation>
        columns={columns}
        data={students}
        rowKey={(s) => s.studentUuid}
        RowComponent={DataTableRow}
      />

    </div>
  );
};
