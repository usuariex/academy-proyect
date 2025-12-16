import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ConteinerClassName?: string;
  message: string;
  confirmText?: string;   // 👈 texto del botón de confirmación
  cancelText?: string;    // 👈 texto del botón de cancelar
  messageClassname?: string;
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  message,
  messageClassname = '',
  ConteinerClassName = '',
  confirmText = "Sí",
  cancelText = "No",
}: ConfirmModalProps) {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContainer} ${ConteinerClassName}`}>
        <p className={`${styles.message} ${messageClassname}`}>{message}</p>
        <div className={styles.modalActions}>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
