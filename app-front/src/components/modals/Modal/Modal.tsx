// src/components/ui/Modal/Modal.tsx
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

type WidthModal = 'sm' | 'md' | 'lg' | 'xl' | 'normal';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: WidthModal;
  title?: string;
  closeOnOverlay?: boolean;
  className?: string;
  contentClassName?: string;
  container?: HTMLElement;
}

export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  width,
  closeOnOverlay = true,
  className,
  contentClassName,
  container,
}: ModalProps) => {


  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;


  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose();
  };




  const modalContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.container} ${width ? styles[width] : ''} ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
          </div>
        )}

        <button
          type="button"
          className={styles.close}
          aria-label="Cerrar"
          onClick={onClose}
        >
          ✖
        </button>

        <div className={`${styles.content} ${contentClassName ?? ''}`}>
          {children}
        </div>
      </div>
    </div>
  );

  // 👇 Aquí decides dónde se monta el modal
  return createPortal(modalContent, container ?? document.body);
};

export default Modal;
