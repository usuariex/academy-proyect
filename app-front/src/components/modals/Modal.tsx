import ReactDOM from "react-dom";
import React, { useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  className = "",
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal"}
    >
      <div
        className={`${styles.modalContent} ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✖
        </button>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );


  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
