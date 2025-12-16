
import type { ReactNode, MouseEvent } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';


export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlay?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  container?: HTMLElement;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnOverlay = true,
  containerClassName = '',
  contentClassName = '',
  container,
}: ModalProps) => {

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null); // 🔹 se crea aquí


  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);


  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      firstInputRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);



  if (!isOpen) return null;



  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose();
  };
  const handleConteinerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };




  const modalContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.container} ${containerClassName}`}
        onClick={handleConteinerClick}
      >

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
        >
          ✖
        </button>

        <div className={`${styles.content} ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );


  return createPortal(modalContent, container ?? document.body);
};

