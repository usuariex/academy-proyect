import React, { useState } from "react";
import styles from "./StudentTabs.module.css";
import type { Student } from "../../../../types";

interface StudentTabsProps {
  student: Student;
}

type TabKey = "evaluations" | "sessions" | "theory";

const StudentTabs: React.FC<StudentTabsProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("evaluations");

  return (
    <div className={styles.studentTabs}>
      <div className={styles.studentTabs__header}>
        <button
          onClick={() => setActiveTab("evaluations")}
          className={`${styles.studentTabs__button} ${
            activeTab === "evaluations" ? styles["studentTabs__button--active"] : ""
          }`}
        >
          Evaluaciones
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`${styles.studentTabs__button} ${
            activeTab === "sessions" ? styles["studentTabs__button--active"] : ""
          }`}
        >
          Sesiones físicas
        </button>
        <button
          onClick={() => setActiveTab("theory")}
          className={`${styles.studentTabs__button} ${
            activeTab === "theory" ? styles["studentTabs__button--active"] : ""
          }`}
        >
          Intentos teóricos
        </button>
      </div>
      <div className={styles.studentTabs__content}>
        {activeTab === "evaluations" && (
          <p>Historial de evaluaciones de {student.fullName}</p>
        )}
        {activeTab === "sessions" && (
          <p>Sesiones físicas realizadas por {student.fullName}</p>
        )}
        {activeTab === "theory" && (
          <p>Intentos teóricos de {student.fullName}</p>
        )}
      </div>
    </div>
  );
};

export default StudentTabs;
