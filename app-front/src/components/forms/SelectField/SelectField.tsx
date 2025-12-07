import type { ChangeEvent } from "react";
import styles from "./SelectField.module.css";
import type { SelectOption } from "@/models";

export interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    placeholder?: string;
}

export function SelectField({
    id,
    label,
    value,
    options,
    onChange,
    className,
    placeholder,
}: SelectFieldProps) {
    return (
        <div className={`${styles.wrapper} ${className ?? ""}`}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>

            <select id={id} className={styles.select} value={value} onChange={onChange}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}