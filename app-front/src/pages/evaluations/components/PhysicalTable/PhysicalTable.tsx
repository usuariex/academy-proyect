import { DataTable } from "@/components/data-display";
import type { Column } from "@/models";
import type { StudentEvaluation } from "@/models/student";
import { PhysicalTableRow } from "@evaluations/components/";
import { useSelectedEvaluation } from "@evaluations/hooks";

interface Props {
    students: StudentEvaluation[];
}

export const PhysicalTable = ({ students }: Props) => {

    const { selectedEvaluation } = useSelectedEvaluation()

    if (!selectedEvaluation) {
        return <p>No hay evaluación seleccionada</p>;
    }
    const evaluation = selectedEvaluation

    const columns: Column<StudentEvaluation>[] = [
        { key: "studentFullName", label: "Alumno" },
        { key: "grade", label: "Nota" },
        { key: "result", label: ` ${evaluation.exerciseUnit}` },
        { key: "studentEvaluationId", label: "Acciones" },
    ];

    return (
        <DataTable
            columns={columns}
            data={students}
            rowKey={(s) => s.studentEvaluationId}
            RowComponent={PhysicalTableRow}
        />
    );
};
