import React from "react";
import styles from "./StudentsTemplate.module.css";
import StudentTable from "../../organisms/StudentTable/StudentTable";
import StudentProfilePanel from "../../organisms/StudentProfilePanel/StudentProfilePanel";
import { useStudentsUI } from "../../../../context/StudentsUIContext";

const StudentsTemplate: React.FC = () => {
  const { selectedStudent } = useStudentsUI();

  return (
    <div className={styles.studentsTemplate}>
      <header className={styles.studentsTemplate__header}>
        <div className={styles.studentsTemplate__actions}>
          <button>Import CSV</button>
        </div>
      </header>

      <div className={styles.studentsTemplate__body}>
        <StudentTable />
        <aside className={styles.studentsTemplate__panel}>
          {selectedStudent ? (
            <StudentProfilePanel />
          ) : (
            <div className={styles["studentsTemplate__panel--placeholder"]}>
              Selecciona un alumno para ver su perfil
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default StudentsTemplate;
