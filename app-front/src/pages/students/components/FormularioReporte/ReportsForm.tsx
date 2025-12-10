import styles from "./ReportsForm.module.css";

export interface DateFormProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onGenerate: () => void;
}

export const ReportsForm = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerate,
}: DateFormProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.Dates}>
        <div>
          <label className={styles.label}>Desde:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={styles.input}
          />
        </div>

        <div>
          <label className={styles.label}>Hasta:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <button onClick={onGenerate} className={styles.button}>
        Generar PDF
      </button>
    </div>
  );
};

export default ReportsForm;
