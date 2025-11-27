import React from 'react';
import styles from './StudentsPage.module.css'; // 👈 importa como objeto
import StudentsTemplate from '../../templates/StudentsTemplate/StudentsTemplate';

const StudentsPage: React.FC = () => {
  return (
    <div className={styles.studentsPage}>
      <StudentsTemplate />
      <div className={styles.studentsPage__content}>
      </div>
    </div>
  );
};

export default StudentsPage;
