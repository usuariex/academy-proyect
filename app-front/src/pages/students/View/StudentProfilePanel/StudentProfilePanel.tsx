import type { StudentProfileResponse } from "@/models/student";
import { StudentSection } from "@students/components";
import { contactSchema, personalSchema, evaluationSchema, addressSchema } from "@students/schemas";
import styles from "./StudentProfilePanel.module.css";

interface Props {
  student: StudentProfileResponse;
  onUpdated: (data: StudentProfileResponse) => void;
}

export const StudentProfilePanel = ({ student, onUpdated }: Props) => {
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h2>{student.fullName}</h2>
        <span className={styles.status}>{student.statusName}</span>
      </header>

      <div className={styles.sections}>
        <div className={styles.personalBlock}>
          <StudentSection
            studentId={student.uuid}
            data={student}
            schema={personalSchema}
            onUpdated={onUpdated}
          />
        </div>

        <div className={styles.contactBlock}>
          <StudentSection
            studentId={student.uuid}
            data={student}
            schema={contactSchema}
            onUpdated={onUpdated}
          />
        </div>

        <div className={styles.evaluationBlock}>
          <StudentSection
            studentId={student.uuid}
            data={student}
            schema={evaluationSchema}
            onUpdated={onUpdated}
          />
        </div>

        <div className={styles.evaluationBlock}>
          <StudentSection
            studentId={student.uuid}
            data={student}
            schema={addressSchema}
            onUpdated={onUpdated}
          />
        </div>
      </div>
    </div>

  );
};
