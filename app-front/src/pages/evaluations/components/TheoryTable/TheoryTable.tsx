import { DataTable } from "@/components/data-display";
import type { Column } from "@/models";
import { TheoryTableRow } from "@evaluations/components/";
import type { StudentEvaluation } from "@/models/student";

interface Props {
    students: StudentEvaluation[];
}

export const TheoryTable = ({ students }: Props) => {

    const columns: Column<StudentEvaluation>[] = [
        { key: "studentFullName", label: "Alumno" },
        { key: "grade", label: "Nota" },
        { key: "result", label: "Respuestas correctas" },
        { key: "studentEvaluationId", label: "Acciones" },
    ];

    return (
        <DataTable
            columns={columns}
            data={students}
            rowKey={(s) => s.studentEvaluationId}
            RowComponent={TheoryTableRow}
        />
    );
};
