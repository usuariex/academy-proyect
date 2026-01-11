import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import styles from "./TimeResultInput.module.css";

interface Props {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function TimeResultInput({ value, onChange, placeholder }: Props) {
    const [rawDigits, setRawDigits] = useState("");
    const [showFormatted, setShowFormatted] = useState(false);

    const formatDigits = (raw: string): string => {
        if (raw.length === 0) return "";
        if (raw.length === 1) return `0'0${raw}"`;
        if (raw.length === 2) return `0'${raw}"`;
        if (raw.length === 3) return `${raw[0]}'${raw.slice(1)}"`;
        if (raw.length === 4) {
            const minutes = raw.slice(0, 2);
            const seconds = raw.slice(2);
            if (minutes.startsWith("0")) return `${minutes[1]}'${seconds}"`;
            return `${minutes}'${seconds}"`;
        }
        if (raw.length === 5) return `${raw.slice(0, 3)}'${raw.slice(3)}"`;
        return raw;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        setRawDigits(raw);
        setShowFormatted(false); // mientras escribes, se muestran crudos + preview
    };

    const confirmFormatted = () => {
        const formatted = formatDigits(rawDigits);
        setShowFormatted(true); // al confirmar, se muestra formateado en el input
        onChange(formatted);
    };

    const handleBlur = () => confirmFormatted();
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") confirmFormatted();
    };

    return (
        <div className={styles.wrapper}>
            <input
                type="text"
                value={showFormatted ? formatDigits(rawDigits) : rawDigits}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={styles.input}
                placeholder={placeholder ?? "mmss"}
            />
            {!showFormatted && rawDigits && (
                <span className={styles.preview}>{formatDigits(rawDigits)}</span>
            )}
        </div>
    );
}
