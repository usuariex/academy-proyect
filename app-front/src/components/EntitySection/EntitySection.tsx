import type { SectionSchema } from "@/models";
import { EditableField } from "@/components";
import styles from "./EntitySection.module.css";

interface EntitySectionProps {
    schema: SectionSchema;
    values: Record<string, any>;
    errors: Record<string, string>;
    editing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onChange: (key: string, val: any) => void;
}

// ✅ Declaración con const y arrow function
export const EntitySection = ({
    schema,
    values,
    errors,
    editing,
    onEdit,
    onCancel,
    onSave,
    onChange,
}: EntitySectionProps) => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h4>{schema.title}</h4>
            </div>

            <div className={styles.fields}>
                {schema.fields.map((f) => (
                    <EditableField
                        key={f.key}
                        label={f.label}
                        value={values[f.key]}
                        type={f.type}
                        editable={!!f.editable}
                        inEdit={editing}
                        options={f.options}
                        onChange={(val) => onChange(f.key, val)}
                        error={errors[f.key]}
                    />
                ))}
            </div>

            <div className={styles.actions}>
                {!editing ? (
                    <button className={`${styles.edit}`} onClick={onEdit}>
                        Editar
                    </button>
                ) : (
                    <>
                        <button className={`${styles.save}`} onClick={onSave}>
                            Guardar
                        </button>
                        <button className={`${styles.cancel}`} onClick={onCancel}>
                            Cancelar
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};