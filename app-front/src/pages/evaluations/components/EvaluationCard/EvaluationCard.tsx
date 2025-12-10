
import React from 'react';
import styles from './EvaluationCard.module.css';
import type { Evaluation } from '@/models/evaluation';

export interface Props {
    evaluation: Evaluation;
    onView?: (evaluation: Evaluation) => void;
    onAssign?: (evaluation: Evaluation) => void;
}

export const EvaluationCard: React.FC<Props> = ({ evaluation, onView, onAssign }) => {


    const formatDate = (iso?: string | null) => {
        if (!iso) return '—';
        try {
            const d = new Date(iso);
            return d.toLocaleDateString();
        } catch {
            return iso;
        }
    };

    return (
        <div className={styles.evaluationCard} role="group" aria-label={`Evaluación ${evaluation.name}`}>
            <div className={styles.evaluationCard__info}>

                <h2 className={styles.evaluationCard__title}>{evaluation.name ?? 'Sin nombre'}</h2>


                <div className={styles.evaluationCard__meta}>

                    <p>
                        <span>Creada:</span> {formatDate(evaluation.createdAt)}
                    </p>

                    <p>
                        <span>Fecha planificada:</span> {formatDate(evaluation.plannedDate)}
                    </p>

                    <p>
                        <span>Estado:</span> {evaluation.statusName ?? '—'}
                    </p>

                    <p>
                        <span>Tipo:</span> {evaluation.typeName ?? '—'}
                    </p>
                    <p>
                        <span>Descripcion:</span> {evaluation.description ?? '—'}
                    </p>
                </div>
            </div>

            <div className={styles.evaluationCard__actions}>
                <button
                    type="button"
                    className={styles.evaluationCard__viewBtn}
                    onClick={() => onView?.(evaluation)}
                    aria-label={`Ir a evaluación ${evaluation.name}`}
                >
                    Ir a evaluación
                </button>

                <button
                    type="button"
                    className={styles.evaluationCard__assignBtn}
                    onClick={() => onAssign?.(evaluation)}
                    aria-label={`Asignar alumnos a ${evaluation.name}`}
                >
                    Asignar alumnos
                </button>
            </div>
        </div>
    );
};

export default EvaluationCard;

