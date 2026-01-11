import styles from './MetricsPanel.module.css';
import type { EvaluationSummary } from '@evaluations/models';

interface Props {
  metrics: EvaluationSummary;
  className?: string;
}

export const MetricsPanel = ({ metrics, className }: Props) => {
  const {
    code,
    totalStudents,
    approved,
    failed,
    ungraded,
    averageGrade,
    maxGrade,
    minGrade,
    medianGrade,
  } = metrics;

  return (
    <section
      className={`${styles.panel} ${className ?? ''}`}
      aria-labelledby={`metrics-${code}`}
    >


      <div className={styles.counters} role="list">
        <div className={styles.counter} role="listitem">
          <div className={styles.counterLabel}>Total</div>
          <div className={styles.counterValue}>{totalStudents}</div>
        </div>
        <div className={styles.counter} role="listitem">
          <div className={styles.counterLabel}>Aprobados</div>
          <div className={styles.counterValue}>{approved}</div>
        </div>
        <div className={styles.counter} role="listitem">
          <div className={styles.counterLabel}>Desaprobados</div>
          <div className={styles.counterValue}>{failed}</div>
        </div>
        <div className={styles.counter} role="listitem">
          <div className={styles.counterLabel}>Sin calificar</div>
          <div className={styles.counterValue}>{ungraded}</div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Promedio</div>
          <div className={styles.statValue}>{averageGrade ?? '—'}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Máx</div>
          <div className={styles.statValue}>{maxGrade ?? '—'}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Mín</div>
          <div className={styles.statValue}>{minGrade ?? '—'}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Mediana</div>
          <div className={styles.statValue}>{medianGrade ?? '—'}</div>
        </div>
      </div>


    </section>
  );
};


