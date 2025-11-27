import React from "react";
import styles from "./StudentRow.module.css";
import type { StudentResponse } from "../../../../types/Student";
import { useStudentsUI } from "../../../../context/StudentsUIContext";

interface StudentRowProps {
  student: StudentResponse;
}

const StudentRow: React.FC<StudentRowProps> = ({ student }) => {
  const { setSelectedStudent, setPanelMode } = useStudentsUI();

  return (
    <tr
      className={styles.studentRow}
      onClick={() => {
        setSelectedStudent(student);
        setPanelMode("profile");
      }}
    >
      <td>{student.fullName}</td>
      <td>{student.email}</td>
      <td>{student.phone}</td>
      <td className={
            student.statusName === "Retirado"
              ? styles.studentRow__badgeRetired
              : student.statusName === "Suspendido"
              ? styles.studentRow__badgeInactive
              : styles.studentRow__badgeActive
          }>
        {student.statusName}
      </td>
      
      <td>
        <button
          onClick={() => setPanelMode("edit")}
          className={styles.studentRow__button}
        >
          ✏️
        </button>
        <button
          onClick={() => console.log("assign")}
          className={styles.studentRow__button}
        >
          📘
        </button>
        <button
          onClick={() => console.log("delete")}
          className={styles.studentRow__button}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default StudentRow;
