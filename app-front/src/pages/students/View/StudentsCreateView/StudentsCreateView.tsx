import React, { useState } from "react";
import styles from "./StudentsCreateView.module.css";
import { useCreateStudent } from "@students/hooks";
import type { StudentRequest } from "@/models";
import { SelectField } from "@/components/forms";
import { useGenders } from "@/hooks/gender";

export const StudentsCreateView: React.FC = () => {
  const [step, setStep] = useState(1);

  const initialFormData: StudentRequest = {
    firstName: "",
    paternalSurname: "",
    maternalSurname: "",
    birthDate: "",
    email: "",
    phone: "",
    statusId: 0,
    genderId: 0,
    weight: 0,
    height: 1.30,
    dni: "",
    isActive: true,
  };

  const [formData, setFormData] = useState<StudentRequest>(initialFormData);


  const { options, loading, error } = useGenders();
  const { mutate, isPending, isError } = useCreateStudent();




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "statusId" ||
          id === "genderId" ||
          id === "weight" ||
          id === "height"
          ? Number(value)
          : value,
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        alert("Alumno registrado correctamente ");
        setFormData(initialFormData);
        setStep(1)
      },
    });
  };



  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);



  {/* solo para pruevas  */ }

  if (loading) return <p>Cargando géneros...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.studentsCreatePage}>
      <h3 className={styles.studentsCreatePage__title}>Crear nuevo estudiante</h3>
      <form className={styles.studentsCreatePage__form} onSubmit={handleSubmit}>

        {step === 1 && (
          <div className={styles.studentsCreatePage__step}>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>Nombres:</label>
              <input id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange} required />
            </div>

            <div className={styles.studentsCreatePage__formGroup}>
              <label>Apellido paterno:</label>
              <input id="paternalSurname"
                type="text"
                value={formData.paternalSurname}
                onChange={handleChange} required />
            </div>

            <div className={styles.studentsCreatePage__formGroup}>
              <label>Apellido materno:</label>
              <input id="maternalSurname"
                type="text"
                value={formData.maternalSurname}
                onChange={handleChange} required />
            </div>

            <div className={styles.studentsCreatePage__formGroup}>
              <label>Fecha nacimiento:</label>
              <input id="birthDate"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={formData.birthDate}
                onChange={handleChange} required />
            </div>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>DNI:</label>
              <input id="dni"
                type="text"
                maxLength={12}
                value={formData.dni}
                onChange={handleChange} required />
            </div>

            <SelectField
              id="genderId"
              label="Sexo"
              value={String(formData.genderId)}
              options={options}
              onChange={handleChange}
              placeholder="Seleccionar"
            />

            <div className={styles.studentsCreatePage__formGroup}>
              <label>Email:</label>
              <input id="email"
                type="email"
                value={formData.email ?? ""}
                onChange={handleChange} />
            </div>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>Celular:</label>
              <input id="phone"
                type="tel"
                value={formData.phone ?? ""}
                onChange={handleChange} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.studentsCreatePage__step}>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>Peso (kg):</label>
              <input id="weight"
                type="number"
                step="0.1"
                min="10"
                max="300"
                value={formData.weight ?? ""}
                onChange={handleChange} />
            </div>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>Estatura (m):</label>
              <input id="height"
                type="number"
                step="0.01"
                min="1.30"
                max="3.00"
                value={formData.height}
                onChange={handleChange} required />
            </div>
            <div className={styles.studentsCreatePage__formGroup}>
              <label>Estado:</label>
              <select id="statusId" value={formData.statusId} onChange={handleChange} required>
                <option value="">Seleccione</option>
                <option value="1">Matriculado</option>
                <option value="2">Suspendido</option>
                <option value="3">Retirado</option>
                <option value="4">Egresado</option>
              </select>
            </div>
            <div className={styles.studentsCreatePage__formGroupCheckbox}>
              <label>
                <input
                  id="isActive" type="checkbox" checked={true} disabled
                /> Activo
              </label>
            </div>
          </div>
        )}

        {/* Botones navegación */}
        <div className={styles.studentsCreatePage__nav}>
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              ⬅ Atrás
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={handleNext}>
              Siguiente ➡
            </button>
          ) : (
            <button type="submit" className={styles.studentsCreatePage__submit} disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar estudiante"}
            </button>
          )}
        </div>
      </form>

      {isError && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
};

export default StudentsCreateView;
