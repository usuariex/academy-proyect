import { EntitySection } from "@/components/data-display";
import { useSectionEditing } from "@/hooks/students";
import { patchStudentProfileAdapter } from "@/adapters";
import { patchStudentProfile } from "@/services";
import type { StudentProfileResponse, SectionSchema } from "@/models";


interface Props {
    studentId: string;
    data: StudentProfileResponse;
    schema: SectionSchema;
    onUpdated: (data: StudentProfileResponse) => void;
}

export const StudentSection: React.FC<Props> = ({ studentId, data, schema, onUpdated }) => {
    const { editing, values, errors, setValue, startEdit, cancelEdit, getPatch } =
        useSectionEditing(schema, data);

    const handleSave = async () => {
        const patch = patchStudentProfileAdapter(getPatch());
        const updated = await patchStudentProfile(studentId, patch);
        onUpdated(updated);
        cancelEdit(); // salir de edición con datos nuevos
    };

    return (
        <EntitySection
            schema={schema}
            values={values}
            errors={errors}
            editing={editing}
            onEdit={startEdit}
            onCancel={cancelEdit}
            onSave={handleSave}
            onChange={setValue}
        />
    );
};