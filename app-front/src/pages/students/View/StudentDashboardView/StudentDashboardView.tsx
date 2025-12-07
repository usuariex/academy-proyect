import type { FC } from "react";
import styles from "./StudentDashboardView.module.css";
import { StudentTable, StudentProfileCard } from "@students/components";
import { useSelectedStudent } from "@students/hooks";

export const StudentDashboardView: FC = () => {
  const { selectedStudent } = useSelectedStudent();

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
            <StudentProfileCard />
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

export default StudentDashboardView;
