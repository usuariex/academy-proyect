import React, { useState } from "react";
import styles from "./StudentFilters.module.css";
import type { StudentStatus } from "../../../../types";
import { SearchInput } from "../../../../components/search/SearchInput";

interface StudentFiltersProps {
  onFilterChange?: (filters: { searchText: string; status?: StudentStatus; group: string }) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({ onFilterChange }) => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<StudentStatus | "">("");
  const [group, setGroup] = useState("");

  const emitChange = (
    next?: Partial<{ searchText: string; status: StudentStatus | ""; group: string }>
  ) => {
    const rawStatus = next?.status ?? status;
    const normalizedStatus = rawStatus === "" ? undefined : (rawStatus as StudentStatus);

    const payload = {
      searchText: next?.searchText ?? searchText,
      status: normalizedStatus,
      group: next?.group ?? group,
    };

    onFilterChange?.(payload);
  };

  return (
    <div className={styles.studentFilters}>
      <SearchInput
        placeholder="Buscar por nombre"
        value={searchText}
        onChange={(value) => {
          setSearchText(value);
          emitChange({ searchText: value });
        }}
        onClear={() => {
          setSearchText("");
          emitChange({ searchText: "" });
        }}
      />

      <select
        value={status}
        onChange={(e) => {
          const val = e.target.value as StudentStatus | "";
          setStatus(val);
          emitChange({ status: val });
        }}
        className={styles.studentFilters__select}
      >
        <option value="">Seleccionar estado</option>
        <option value="Suspendido">Suspendido</option>
        <option value="Retirado">Retirado</option>
        <option value="Matriculado">Matriculado</option>
      </select>

      <select
        value={group}
        onChange={(e) => {
          const val = e.target.value;
          setGroup(val);
          emitChange({ group: val });
        }}
        className={styles.studentFilters__select}
      >
        <option value="">Grupo</option>
        <option value="A">Grupo A</option>
        <option value="B">Grupo B</option>
      </select>
    </div>
  );
};

export default StudentFilters;
