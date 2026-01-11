import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./DecimalResultInput.module.css";

interface Props {
    value: string;
    onChange: (val: string) => void;
    min?: number;
    max?: number;
    placeholder?: string;
}

export const DecimalResultInput = ({ value, onChange, min, max, placeholder }: Props) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = Number(raw);

        if (raw === "" || !isNaN(num)) {
            if (min !== undefined && num < min) {
                setError(`≥ ${min}`);
            } else if (max !== undefined && num > max) {
                setError(`≤ ${max}`);
            } else {
                setError(null);
            }
            onChange(raw);
        } else {
            setError("Número inválido");
            onChange(raw);
        }
    };

    return (
        <div className={styles.wrapper}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                placeholder={placeholder ?? "0.00"}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
