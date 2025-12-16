import { useState } from "react";
import styles from "./AssignStudentsModal.module.css";
import { useAssignStudents, useRemoveStudents } from "@evaluations/hooks/";
import { useStudentsByEvaluation } from "@/hooks/students";
import { useSelectedEvaluation } from "@evaluations/hooks";
import { Modal } from "@/components/modals";

interface AssignStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AssignStudentsModal({ isOpen, onClose }: AssignStudentsModalProps) {
    const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
    const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);

    const assignMutation = useAssignStudents();
    const removeMutation = useRemoveStudents();

    // obtenemos la evaluación seleccionada del contexto
    const { selectedEvaluation } = useSelectedEvaluation();
    const evaluationCode = selectedEvaluation?.code;

    // hook que trae asignados y disponibles
    const { data, isLoading } = useStudentsByEvaluation(evaluationCode || "");
    const assigned = data?.assigned || [];
    const available = data?.available || [];

    const handleSave = async () => {
        if (selectedToAdd.length > 0) {
            await assignMutation.mutateAsync({ students: selectedToAdd });
        }
        if (selectedToRemove.length > 0) {
            await removeMutation.mutateAsync({ students: selectedToRemove });
        }
        onClose();
    };

    if (!isOpen || !evaluationCode) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} containerClassName={styles.container__custom}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Editar estudiantes asignados</h2>

                {isLoading ? (
                    <p>Cargando estudiantes...</p>
                ) : (
                    <div className={styles.listsContainer}>
                        {/* Lista de asignados */}
                        <div className={styles.list}>
                            <h3>Asignados</h3>
                            <ul>
                                {assigned.map((student) => (
                                    <li
                                        key={student.studentUuid}
                                        className={`${styles.item} ${selectedToRemove.includes(student.studentUuid) ? styles.selectedRemove : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedToRemove((prev) =>
                                                prev.includes(student.studentUuid)
                                                    ? prev.filter((u) => u !== student.studentUuid)
                                                    : [...prev, student.studentUuid]
                                            )
                                        }
                                    >
                                        {student.studentFullName}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Lista de disponibles */}
                        <div className={styles.list}>
                            <h3>Disponibles</h3>
                            <ul>
                                {available.map((student) => (
                                    <li
                                        key={student.uuid}
                                        className={`${styles.item} ${selectedToAdd.includes(student.uuid) ? styles.selectedAdd : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedToAdd((prev) =>
                                                prev.includes(student.uuid)
                                                    ? prev.filter((u) => u !== student.uuid)
                                                    : [...prev, student.uuid]
                                            )
                                        }
                                    >
                                        {student.fullName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave}>
                        Guardar cambios
                    </button>
                </div>
            </div>
        </Modal>
    );
}
