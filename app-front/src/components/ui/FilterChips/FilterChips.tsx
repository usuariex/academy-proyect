import styles from "./FilterChips.module.css";

import type { FilterChip } from "@/models/ui"

interface FilterChipsProps {
    chips: FilterChip[];
}

export const FilterChips = ({ chips }: FilterChipsProps) => {
    if (!chips.length) return null;

    return (
        <div className={styles.chipContainer}>
            {chips.map((chip, index) => (
                <div key={index} className={styles.chip}>
                    <span className={styles.chipLabel}>{chip.label}</span>
                    <button
                        type="button"
                        onClick={chip.onRemove}
                        className={styles.chipClose}
                        aria-label={`Eliminar filtro ${chip.label}`}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};
