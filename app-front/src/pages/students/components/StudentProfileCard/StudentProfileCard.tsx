import { useState } from 'react';
import type { FC } from 'react';
import styles from './StudentProfileCard.module.css';
import { useSelectedStudent } from "@students/hooks";
import { Modal } from '@/components';
import { useStudentProfile } from '@students/hooks'
import { StudentProfilePanel } from '@students/View'
import { ReportsForm } from '@students/components'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const StudentProfileCard: FC = () => {

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFormReport, setFormReport] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { selectedStudent } = useSelectedStudent();

  const handleGeneratePDF = () => {
    const url = `http://localhost:8000/reports/academic/?alumno_id=${selectedStudent?.uuid}&fecha_inicio=${startDate}&fecha_fin=${endDate}&output=pdf`;
    window.open(url, "_blank");
    setFormReport(false);
  };


  if (!selectedStudent) return null;
  const { data: profile, isLoading, error, refetch } = useStudentProfile(selectedStudent?.uuid ?? 0);


  const handleOpenProfile = async () => {
    setShowProfileModal(true);
    setFormReport(false);
    await refetch(); // aquí disparas la petición manualmente
  };

  const container = document.getElementById('main__content')!;
  return (
    <div className={styles.studentProfileCard}>

      <div className={styles.studentProfileCard__card}>
        <FontAwesomeIcon icon={faUser} />
        <h2>{selectedStudent.fullName}</h2>
        <p><strong>Email:</strong> {selectedStudent.email}</p>
        <p><strong>Teléfono:</strong> {selectedStudent.phone}</p>
        <p><strong>DNI:</strong> {selectedStudent.dni}</p>
        <p><strong>Estado:</strong> {selectedStudent.statusName}</p>
        <p><strong>Grupo:</strong> {selectedStudent.genderName}</p>
      </div>

      <div className={styles.studentProfileCard__actions}>
        <button
          className={styles.studentProfileCard__viewBtn}
          onClick={handleOpenProfile}
        >
          Ver perfil
        </button>
        <button
          className={styles.studentProfileCard__assignBtn}
        >
          Asignar a evaluación
        </button>
      </div>


      <div>
        {!showFormReport ? (
          <button className={styles.GenerteReport} onClick={() => setFormReport(true)}>Generar reporte de notas</button>
        ) : (
          <ReportsForm
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onGenerate={handleGeneratePDF}
          />
        )}
      </div>


      <Modal
        title='Detalle del estudiante'
        isOpen={showProfileModal && !!profile}
        onClose={() => setShowProfileModal(false)}
        container={container}
      >
        {isLoading && <p>Cargando...</p>}
        {error && <p>Error al cargar perfil</p>}

        {profile && (
          <StudentProfilePanel
            student={profile}
            onUpdated={() => refetch()}

          /* onClose={() => setShowProfileModal(false)} */
          />
        )}
      </Modal>
    </div>
  );
};

export default StudentProfileCard;
