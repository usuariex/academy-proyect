import type { Column } from '@/models'

interface DataTableRowProps<T> {
    row: T;
    columns: Column<T>[];
}

export function DataTableRow<T>({ row, columns }: DataTableRowProps<T>) {
    return (
        <tr>
            {columns.map((col) => (
                <td key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
            ))}
        </tr>
    );
}
