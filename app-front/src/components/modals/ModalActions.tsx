import React from "react";
import styles from "./ModalActions.module.css";

interface Props {
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  closeLabel?: string;
  showSave?: boolean;
}

const ModalActions: React.FC<Props> = ({
  onClose,
  onSave,
  saveLabel = "Guardar cambios",
  closeLabel = "Cerrar",
  showSave = true,
}) => (
  <div className={styles.actions}>
    {showSave && onSave && (
      <button className={`${styles.btn} ${styles.primary}`} onClick={onSave}>
        {saveLabel}
      </button>
    )}
    <button className={`${styles.btn} ${styles.secondary}`} onClick={onClose}>
      {closeLabel}
    </button>
  </div>
);

export default ModalActions;
