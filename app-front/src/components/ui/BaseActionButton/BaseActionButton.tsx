import styles from "./BaseActionButton.module.css";

interface Props {
  label: string;
  type: string;
  onClick: () => void;
  disabled?: boolean;
}

export const BaseActionButton = ({ label, type, onClick, disabled }: Props) => {
  return (
    <button
      className={`${styles.button} ${styles[`btn-${type}`]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};