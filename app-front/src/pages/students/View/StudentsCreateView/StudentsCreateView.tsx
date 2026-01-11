import React, { useState } from "react";
import styles from "./StudentsCreateView.module.css";
import { useCreateStudent } from "@students/hooks";
import type { StudentRequest } from "@/models/student";
import { SelectField } from "@/components/forms";
import { useGenders } from "@/hooks/gender";

export const StudentsCreateView = () => {
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
      [id]: ["statusId", "genderId", "weight", "height"].includes(id)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        alert("Alumno registrado correctamente");
        setFormData(initialFormData);
      },
    });
  };

  if (loading) return <p>Cargando géneros...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.studentsCreatePage}>
      <h2 className={styles.title}>Registro de Estudiante</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {/* Columna izquierda */}
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label>Nombres</label>
              <input id="firstName" type="text" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Apellido paterno</label>
              <input id="paternalSurname" type="text" value={formData.paternalSurname} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Apellido materno</label>
              <input id="maternalSurname" type="text" value={formData.maternalSurname} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha nacimiento</label>
              <input id="birthDate" type="date" max={new Date().toISOString().split("T")[0]} value={formData.birthDate} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>DNI</label>
              <input id="dni" type="text" maxLength={12} value={formData.dni} onChange={handleChange} />
            </div>
            <SelectField
              id="genderId"
              label="Sexo"
              value={String(formData.genderId)}
              options={options}
              onChange={handleChange}
              placeholder="Seleccionar"
            />
          </div>

          {/* Columna derecha */}
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input id="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Celular</label>
              <input id="phone" type="tel" value={formData.phone ?? ""} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Peso (kg)</label>
              <input id="weight" type="number" step="0.1" min="10" max="300" value={formData.weight ?? ""} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Estatura (m)</label>
              <input id="height" type="number" step="0.01" min="1.30" max="3.00" value={formData.height} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Estado</label>
              <select id="statusId" value={formData.statusId} onChange={handleChange}>
                <option value="">Seleccione</option>
                <option value="1">Matriculado</option>
                <option value="2">Suspendido</option>
                <option value="3">Retirado</option>
                <option value="4">Egresado</option>
              </select>
            </div>
            <div className={styles.formGroupCheckbox}>
              <label>
                <input id="isActive" type="checkbox" checked={true} disabled /> Activo
              </label>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar estudiante"}
          </button>
        </div>
      </form>
      {isError && <p className={styles.error}>Error al guardar</p>}
    </div>
  );
}

