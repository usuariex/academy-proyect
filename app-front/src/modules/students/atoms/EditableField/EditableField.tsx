import React, { useState } from "react";
import styles from "./EditableField.module.css";

interface Props {
  label: string;
  value: string;
  editable?: boolean;
  onSave?: (newValue: string) => void;
  countryFlag?: string;
}

const EditableField: React.FC<Props> = ({ label, value, editable = true, onSave, countryFlag }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const handleToggle = () => {
    if (editing && onSave) onSave(val);
    setEditing(!editing);
  };

  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}:</div>

      {editing ? (
        <input className={styles.input} value={val} onChange={(e) => setVal(e.target.value)} />
      ) : (
        <div className={styles.value}>{val}</div>
      )}

      {countryFlag && <img className={styles.flag} src={countryFlag} alt="flag" />}

      {editable && (
        <button className={styles.iconBtn} onClick={handleToggle} aria-label={editing ? "Guardar" : "Editar"}>
          {editing ? "💾" : "✏️"}
        </button>
      )}
    </div>
  );
};

export default EditableField;
