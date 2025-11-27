import React from "react";
import styles from "./Modal.module.css";

interface Props {
  title?: string;
  onClose?: () => void;
}

const ModalHeader: React.FC<Props> = ({ title, onClose }) => (
  <header className={styles.modalHeader}>
    <h2 className={styles.modalTitle}>{title}</h2>
    {onClose && (
      <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">✖</button>
    )}
  </header>
);

export default ModalHeader;
