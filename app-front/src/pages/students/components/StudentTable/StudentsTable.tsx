import { useState } from "react";
import styles from "./StudentsTable.module.css";
import StudentFilters from "../StudentFilters/StudentFilters";
import { useDeleteStudent, useSelectedStudent, useStudents } from "@students/hooks";
import type { Student, StudentStatus } from "@/models";
import { useDeactivateStudent } from "@students/hooks";

type Filters = {
  searchText: string;
  status?: StudentStatus;
  group: string;
};

export const StudentTable = () => {

  const { data: students, isLoading, isError } = useStudents(true);
  const { mutate: deactivateStudent } = useDeactivateStudent();


  const { mutate: deleteStudentMutate } = useDeleteStudent();

  const { setSelectedStudent } = useSelectedStudent();

  const [filters, setFilters] = useState<Filters>({
    searchText: "",
    status: undefined,
    group: "",
  });


  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar estudiantes</p>;
  if (!students) return null;


  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastNameFather} ${student.lastNameMother}`.toLowerCase();

    const matchesSearch =
      !filters.searchText || fullName.includes(filters.searchText.toLowerCase());
    const matchesStatus =
      !filters.status || student.statusName === filters.status;
    const matchesGroup =
      !filters.group || student.genderName === filters.group;

    return matchesSearch && matchesStatus && matchesGroup;
  });



  return (
    <div className={styles.studentTable}>
      <StudentFilters onFilterChange={setFilters} />

      <table className={styles.studentTable__table}>
        <thead>
          <tr>
            <th className={styles.studentTable__th}>Nombre completo</th>
            <th className={styles.studentTable__th}>codigo</th>
            <th className={styles.studentTable__th}>Correo</th>
            <th className={styles.studentTable__th}>Teléfono</th>
            <th className={styles.studentTable__th}>Estado</th>
            <th className={styles.studentTable__th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents?.map((student: Student) => (
            <tr
              key={student.id}
              className={styles.studentRow}
              onClick={() => {
                setSelectedStudent(student);
              }}
            >
              <td>{student.fullName}</td>
              <td>{student.code}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td
                className={
                  student.statusName === "Retirado"
                    ? styles.studentRow__badgeRetired
                    : student.statusName === "Suspendido"
                      ? styles.studentRow__badgeInactive
                      : styles.studentRow__badgeActive
                }
              >
                {student.statusName}
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={styles.studentRow__button}
                >
                  ✏️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("¿Deseas eliminar este alumno?")) {
                      deactivateStudent(student.uuid);
                    }
                  }}
                  className={styles.studentRow__button}
                >
                  🗑️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("¿Este alumno se eliminara de forma permanente, aceptar?")) {
                      deleteStudentMutate(student.uuid);
                    }
                  }}
                  className={styles.studentRow__button}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable