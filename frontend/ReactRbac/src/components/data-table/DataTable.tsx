import type { ReactNode } from "react";

export type ColumnDef<T> = {
    id: string;
    header: string;
    accessorFn?: (row: T) => ReactNode;
    cell?: (props: { row: { original: T } }) => ReactNode;
};

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    maxHeight?: string;
};

export function DataTable<T>({ data, columns, maxHeight = "400px" }: DataTableProps<T>) {
    return (
        <div className="table-responsive" style={{ maxHeight, overflowY: "auto" }}>
            <table className="table table-hover table-custom mb-0">
                <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.id} className="text-muted fw-bold small text-uppercase py-3" style={{ backgroundColor: "#fff", borderBottom: "2px solid #dee2e6" }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-4 text-muted">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col) => {
                                    let content: ReactNode = null;
                                    if (col.cell) {
                                        content = col.cell({ row: { original: row } });
                                    } else if (col.accessorFn) {
                                        content = col.accessorFn(row);
                                    }
                                    return (
                                        <td key={col.id} className="align-middle">
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
