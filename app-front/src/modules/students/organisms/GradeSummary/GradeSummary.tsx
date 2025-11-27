import React from "react";
import styles from "./GradeSummary.module.css";

/* interface Grades { average: number; best: number; worst: number; } */
interface Grades { average: any; best: any; worst: any; }

interface Props { grades: Grades; }

const GradeSummary: React.FC<Props> = ({ grades }) => (
  <section className={styles.section}>
    <h4 className={styles.title}>Calificaciones</h4>
    <div className={styles.grid}>
      <div className={styles.item}>
        <div className={styles.value}>{grades.average}</div>
        <div className={styles.label}>Promedio</div>
      </div>
      <div className={styles.item}>
        <div className={styles.value}>{grades.best}</div>
        <div className={styles.label}>Mejor</div>
      </div>
      <div className={styles.item}>
        <div className={styles.value}>{grades.worst}</div>
        <div className={styles.label}>Peor</div>
      </div>
    </div>
  </section>
);

export default GradeSummary;
