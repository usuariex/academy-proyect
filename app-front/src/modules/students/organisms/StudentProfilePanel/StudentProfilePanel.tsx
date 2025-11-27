import React, { useState } from 'react';
import styles from './StudentProfilePanel.module.css';
import { useStudentsUI } from '../../../../context/StudentsUIContext';
import Modal from '../../../../components/modals/Modal';
import { useStudentProfile } from '../../hooks/useStudents'
import ReportsForm from '../FormularioReporte/ReportsForm'
import StudentProfileModal from '../../modals/StudentProfileModal/StudentProfileModal';
/* import AssignEvaluationModal from '../../modals/AssignEvaluationModal/AssignEvaluationModal'; */
/* import StudentTabs from '../../molecules/StudentTabs/StudentTabs'; */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




const StudentProfilePanel: React.FC = () => {
  const { selectedStudent } = useStudentsUI();
  const [showProfileModal, setShowProfileModal] = useState(false);
  /* const [showAssignModal, setShowAssignModal] = useState(false); */

  /* Reportes */
  const [showFormReport, setFormReport] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleGeneratePDF = () => {
    
    const url = `http://localhost:8000/reports/academic/?alumno_id=${1}&fecha_inicio=${startDate}&fecha_fin=${endDate}&output=pdf`;
    window.open(url, "_blank");
    setFormReport(false);
  };





  if (!selectedStudent) return null;
  const { data: profile, isLoading, error, refetch } = useStudentProfile(selectedStudent?.id ?? 0);

  if (!selectedStudent) return null;

  const handleOpenProfile = async () => {
    setShowProfileModal(true);
    setFormReport(false);
    await refetch(); // aquí disparas la petición manualmente
  };


  return (
    <div className={styles.studentProfilePanel}>


      <div className={styles.studentProfilePanel__card}>
        <FontAwesomeIcon icon={faUser} />
        <h2>{selectedStudent.fullName}</h2>
        <p><strong>Email:</strong> {selectedStudent.email}</p>
        <p><strong>Teléfono:</strong> {selectedStudent.phone}</p>
        <p><strong>DNI:</strong> {selectedStudent.dni}</p>
        <p><strong>Estado:</strong> {selectedStudent.statusName}</p>
        <p><strong>Grupo:</strong> {selectedStudent.genderName}</p>
      </div>


      <div className={styles.studentProfilePanel__actions}>
        <button
          className={styles.studentProfilePanel__viewBtn}
          onClick={handleOpenProfile}
        >
          Ver perfil completo
        </button>
        <button
          className={styles.studentProfilePanel__assignBtn}
        /* onClick={() => setShowAssignModal(true)} */
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



      {showProfileModal && profile && (
        <Modal
          title="Perfil completo"
          onClose={() => {
            setShowProfileModal(false);
          }}
        >
          {isLoading && <p>Cargando...</p>}
          {error && <p>Error al cargar perfil</p>}

          {profile && (
            <StudentProfileModal
              student={profile}
              onClose={() => setShowProfileModal(false)}
            />
          )}
        </Modal>
      )}

      {/*  {showAssignModal && selectedStudent && (
        <Modal
          title="Asignar evaluación"
          onClose={() => {
            setShowAssignModal(false);
          }}
        >
          <AssignEvaluationModal
            student ={selectedStudent}
            onClose={() => {
              setShowAssignModal(false);
            }}
            onAssign={(payload) => {
              // lógica para asignar evaluación
              setShowAssignModal(false);
            }}
          />
        </Modal>
      )} */}
    </div>
  );
};

export default StudentProfilePanel;
