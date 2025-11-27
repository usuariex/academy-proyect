import React, { useState } from 'react';
import styles from './StudentTable.module.css'; // 👈 importa como objeto
import StudentRow from '../../atoms/StudentRow/StudentRow';
import StudentFilters from '../../molecules/StudentFilters/StudentFilters';
import { useStudents } from '../../hooks/useStudents';
import type { StudentStatus } from '../../../../types';

type Filters = {
  searchText: string;
  status?: StudentStatus;
  group: string
};


const StudentTable: React.FC = () => {
  const { data: students, isLoading, isError } = useStudents();
  const [filters, setFilters] = useState<Filters>({ searchText: "", status: undefined, group: "" });


  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar estudiantes</p>;
  if (!students) return null;


  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastNameFather} ${student.lastNameMother}`.toLowerCase();

    const matchesSearch = !filters.searchText || fullName.includes(filters.searchText.toLowerCase());
    const matchesStatus = !filters.status || student.statusName === filters.status;
    const matchesGroup = !filters.group || student.genderName === filters.group;

    return matchesSearch && matchesStatus && matchesGroup;
  });



  return (
    <div className={styles.studentTable}>

      <StudentFilters
        onFilterChange={setFilters} />

      <table className={styles.studentTable__table}>
        <thead>
          <tr>
            <th className={styles.studentTable__th}>Nombre completo</th>
            <th className={styles.studentTable__th}>correo</th>
            <th className={styles.studentTable__th}>telefono</th>
            <th className={styles.studentTable__th}>Estado</th>
            <th className={styles.studentTable__th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents?.map((student) => (
            <StudentRow
              key={student.id}
              student={student} />

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
