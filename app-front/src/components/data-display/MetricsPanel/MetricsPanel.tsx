import React from 'react';
import styles from './MetricsPanel.module.css';
import type { EvaluationSummary } from '@evaluations/models';

interface Props {
  metrics: EvaluationSummary;
  compact?: boolean;
  className?: string;
}

export const MetricsPanel: React.FC<Props> = ({ metrics, compact = false, className }) => {
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
    /*gradeDistribution,
     statusDistribution, */
  } = metrics;

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : ''} ${className ?? ''}`}
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

      {/* <div className={styles.distributions}>
        <div className={styles.distBlock}>
          <h5 className={styles.distTitle}>Distribución de notas</h5>
          <ul className={styles.distList}>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>0-10</span>
              <span className={styles.distCount}>{gradeDistribution['0-10']}</span>
              <div
                className={styles.distBar}
                style={{
                  width: `${Math.min(100, (gradeDistribution['0-10'] / Math.max(1, totalStudents)) * 100)}%`,
                }}
              />
            </li>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>11-15</span>
              <span className={styles.distCount}>{gradeDistribution['11-15']}</span>
              <div
                className={styles.distBar}
                style={{
                  width: `${Math.min(100, (gradeDistribution['11-15'] / Math.max(1, totalStudents)) * 100)}%`,
                }}
              />
            </li>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>16-20</span>
              <span className={styles.distCount}>{gradeDistribution['16-20']}</span>
              <div
                className={styles.distBar}
                style={{
                  width: `${Math.min(100, (gradeDistribution['16-20'] / Math.max(1, totalStudents)) * 100)}%`,
                }}
              />
            </li>
          </ul>
        </div>

        <div className={styles.distBlock}>
          <h5 className={styles.distTitle}>Estados (%)</h5>
          <ul className={styles.distList}>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>Aprobados</span>
              <span className={styles.distCount}>{statusDistribution.approved}%</span>
              <div
                className={styles.distBar}
                style={{ width: `${Math.min(100, statusDistribution.approved)}%` }}
              />
            </li>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>Desaprobados</span>
              <span className={styles.distCount}>{statusDistribution.failed}%</span>
              <div
                className={styles.distBar}
                style={{ width: `${Math.min(100, statusDistribution.failed)}%` }}
              />
            </li>
            <li className={styles.distItem}>
              <span className={styles.distLabel}>Sin calificar</span>
              <span className={styles.distCount}>{statusDistribution.ungraded}%</span>
              <div
                className={styles.distBar}
                style={{ width: `${Math.min(100, statusDistribution.ungraded)}%` }}
              />
            </li>
          </ul>
        </div>
      </div> */}
    </section>
  );
};

export default MetricsPanel;
