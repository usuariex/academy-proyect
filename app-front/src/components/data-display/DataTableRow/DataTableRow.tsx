import type { Column } from '@/models'
import styles from "./DataTableRow.module.css";

interface DataTableRowProps<T> {
    row: T;
    columns: Column<T>[];
}

export function DataTableRow<T>({ row, columns }: DataTableRowProps<T>) {
    return (
        <tr>
            {columns.map((col) => (
                <td
                    key={String(col.key)}
                    className={col.key === "actions" ? styles.actionsCell : undefined}
                >
                    {col.key === "actions"
                        ? col.render?.(null, row)
                        : col.render
                            ? col.render(row[col.key as keyof T], row)
                            : String(row[col.key as keyof T])}
                </td>
            ))}
        </tr>

    );
}
