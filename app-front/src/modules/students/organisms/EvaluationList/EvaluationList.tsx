import React from "react";
import styles from "./EvaluationList.module.css";

interface Eval { subject: string; grade: string; date?: string; }

interface Props { evaluations: Eval[]; }

const EvaluationList: React.FC<Props> = ({ evaluations }) => (
  <section className={styles.section}>
    <h4 className={styles.title}>Evaluaciones</h4>
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          <th>Evaluación</th>
          <th>Resultado</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {evaluations.map((e, i) => (
          <tr key={i} className={styles.row}>
            <td className={styles.cell}>{e.subject}</td>
            <td className={styles.cell}>{e.grade}</td>
            <td className={styles.cell}>{e.date || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default EvaluationList;
