import type { ComponentType } from 'react'
import styles from "./DataTable.module.css";
import { DataTableRow } from '@/components/data-display'
import type { Column } from '@/models'


interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    RowComponent?: ComponentType<{ row: T; columns: Column<T>[] }>;
}

export function DataTable<T>({
    columns,
    data,
    rowKey,
    RowComponent = DataTableRow,
}: DataTableProps<T>) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <RowComponent key={rowKey(row)} row={row} columns={columns} />
                ))}
            </tbody>
        </table>
    );
}
