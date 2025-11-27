import React from "react";
import StudentHeader from "../../molecules/StudentHeader/StudentHeader";
import StudentSection from "../../organisms/StudentSection/StudentSection";
/* import EvaluationList from "../../organisms/EvaluationList/EvaluationList";
import GradeSummary from "../../organisms/GradeSummary/GradeSummary"; */
import type { StudentProfileResponse } from "../../../../types";
import styles from "./StudentProfileModal.module.css";

interface Props { 
  student: StudentProfileResponse; 
  onClose: () => void; 
  onSave?: () => void; 
}

const StudentProfileModal: React.FC<Props> = ({ student}) => {
  return (
   <>

   
      <StudentHeader student={student} />

      <div className={styles.grid}>
        <StudentSection 
          title="Datos personales" 
          fields={[
            { label: "DNI", value: student.dni, editable: true },
            { label: "Fecha de nacimiento", value: student.birthDate, editable: false },
            { label: "Género", value: student.genderName, editable: false },
          ]} 
        />

        <StudentSection 
          title="Contacto" 
          fields={[
            { label: "Email", value: student.email ?? "", editable: true },
            { label: "Teléfono", value: student.phone ?? "", editable: true },
            { label: "Dirección", value: student.address?.street ?? "", editable: true },
          ]} 
        />


        <StudentSection 
          title="Evaluaciones" 
          fields={[
            { label: "Email", value: student.email ?? "", editable: true },
            { label: "Teléfono", value: student.phone ?? "", editable: true },
            { label: "Dirección", value: student.address?.street ?? "", editable: true },
          ]} 
        />

        {/* <EvaluationList evaluations={student.evaluations ?? []} /> */}
        {/* <GradeSummary grades={student.grades ?? []} /> */}
      </div>

   </>
  );
};

export default StudentProfileModal;
