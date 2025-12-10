import { useMemo, useState, useEffect } from "react";
import { getByPath, buildChangedPatch } from "@/utilities/evaluation";
import type { SectionSchema } from "@/models";

export function useSectionEditing<T extends object>(schema: SectionSchema, data: T) {

    const initialValues = useMemo(() => {
        const map: Record<string, any> = {};
        schema.fields.forEach((f) => {
            map[f.key] = getByPath(data, f.key);
        });
        return map;
    }, [schema, data]);

    // Estado de edición
    const [editing, setEditing] = useState(false);
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Resetear valores cuando cambie el data
    useEffect(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    // Lista de claves editables
    const editableKeys = useMemo(
        () => schema.fields.filter((f) => f.editable).map((f) => f.key),
        [schema]
    );

    // Cambiar un valor
    const setValue = (key: string, raw: any) => {
        const field = schema.fields.find((f) => f.key === key);
        const parsed = field?.parser ? field.parser(raw) : raw;

        setValues((prev) => ({ ...prev, [key]: parsed }));

        if (field?.validate) {
            const msg = field.validate(parsed);
            setErrors((prev) => ({ ...prev, [key]: msg ?? "" }));
        }
    };

    // Control de edición
    const startEdit = () => setEditing(true);
    const cancelEdit = () => {
        setValues(initialValues);
        setErrors({});
        setEditing(false);
    };

    // Construir PATCH solo con cambios
    const getPatch = () => buildChangedPatch(values, initialValues, editableKeys);

    return {
        editing,
        values,
        errors,
        setValue,
        startEdit,
        cancelEdit,
        getPatch,
        editableKeys,
    };
}
