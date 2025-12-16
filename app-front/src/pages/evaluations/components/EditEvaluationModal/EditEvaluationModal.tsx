// EditEvaluationModal.tsx
import { useState } from "react";
import { useUpdateEvaluation } from "@evaluations/hooks/";
import { Modal } from "@/components/modals";
import { BaseActionButton } from "@/components/ui";
import type { Evaluation } from "@/models/evaluation";
import { evaluationActions } from "@evaluations/constants";
import styles from "./EditEvaluationModal.module.css";
import { formatDateTime } from "@/utilities";
import type { evaluationStatus, Exercise, TheoryConfig } from "@evaluations/models";

interface Props {
    evaluation: Evaluation;
    onClose: () => void;
    status: evaluationStatus[];
    exercises?: Exercise[];
    configs?: TheoryConfig[];
}

export const EditEvaluationModal = ({
    evaluation,
    onClose,
    exercises = [],
    configs = [],
    status = [],
}: Props) => {

    const { update, isSaving, error } = useUpdateEvaluation(
        evaluation.code,
        evaluation.hasGradedStudents
    );


    const [formData, setFormData] = useState({
        description: evaluation.description ?? "",
        plannedDate: evaluation.plannedDate ? evaluation.plannedDate.slice(0, 10) : "",
        statusId: evaluation.statusId ?? null,
        exerciseId: evaluation.exerciseId ?? null,
        configId: evaluation.configId ?? null,
    });

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const payload: Partial<Evaluation> = {};

        if (formData.description !== evaluation.description) {
            payload.description = formData.description;
        }
        if (formData.plannedDate && formData.plannedDate !== evaluation.plannedDate?.slice(0, 10)) {
            payload.plannedDate = formData.plannedDate;
        }
        if (formData.statusId !== evaluation.statusId) {
            payload.statusId = formData.statusId;
        }
        if (formData.exerciseId !== evaluation.exerciseId && formData.exerciseId !== null) {
            payload.exerciseId = formData.exerciseId;
        }
        if (formData.configId !== evaluation.configId && formData.configId !== null) {
            payload.configId = formData.configId;
        }

        console.log("Payload enviado:", payload);

        const updated = await update(payload);
        if (updated) {
            console.log("Actualizado correctamente", updated);
            onClose();
        }
    };


    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            containerClassName={styles.container__custom}
        >

            <h2 className={styles.title}>{evaluation.name}</h2>

            <div className={styles.infoBlock}>
                <p><strong>Código: </strong> {evaluation.code}</p>
                <p><strong>Creada: </strong> {formatDateTime(evaluation.createdAt)}</p>
                <p><strong>Nº de estudiantes: </strong> {evaluation.studentsCount}</p>
            </div>

            <form className={styles.form}>
                <label>
                    Fecha planificada:
                    <input
                        type="date"
                        value={formData.plannedDate}
                        onChange={(e) => handleChange("plannedDate", e.target.value)}
                        disabled={evaluation.hasGradedStudents}
                    />
                </label>

                <label>
                    Estado:
                    <select
                        value={formData.statusId ?? ""}
                        onChange={(e) =>
                            handleChange("statusId", e.target.value ? Number(e.target.value) : null)
                        }
                    >
                        <option value="">Seleccione estado</option>
                        {status.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Ejercicio solo si es Fisica */}
                {evaluation.typeName === "Fisica" && (
                    <label>
                        Ejercicio:
                        {evaluation.hasGradedStudents ? (
                            <input value={evaluation.exerciseName ?? "—"} readOnly />
                        ) : (
                            <select
                                value={formData.exerciseId ?? ""}
                                onChange={(e) =>
                                    handleChange("exerciseId", e.target.value ? Number(e.target.value) : null)
                                }
                            >
                                <option value="">Seleccione ejercicio</option>
                                {exercises.map((ex) => (
                                    <option key={ex.id} value={ex.id}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>
                )}

                {/* Configuración solo si es Teorica */}
                {evaluation.typeName === "Teorica" && (
                    <label>
                        Configuración:
                        {evaluation.hasGradedStudents ? (
                            <input value={evaluation.configName ?? "—"} readOnly />
                        ) : (
                            <select
                                value={formData.configId ?? ""}
                                onChange={(e) =>
                                    handleChange("configId", e.target.value ? Number(e.target.value) : null)
                                }
                            >
                                <option value="">Seleccione configuración</option>
                                {configs.map((cfg) => (
                                    <option key={cfg.id} value={cfg.id}>
                                        {cfg.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>
                )}

                <label>
                    Descripción:
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </label>
            </form>

            {error && <span className={styles.error}>{error}</span>}

            <div className={styles.actions}>
                <BaseActionButton
                    {...evaluationActions.save}
                    onClick={handleSave}
                    disabled={isSaving}
                />
            </div>
        </Modal>
    );
};
