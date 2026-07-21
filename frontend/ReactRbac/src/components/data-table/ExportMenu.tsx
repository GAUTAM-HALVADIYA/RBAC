import { useExport } from "./hooks/useExport";
import type { ColumnDef } from "./types";

type Props<T> = {
    rows: T[];
    columns: ColumnDef<T>[];
    fileName?: string;
};

export function ExportMenu<T>({ rows, columns, fileName = "table-data" }: Props<T>) {
    const { exportExcel, exportCSV, exportPDF } = useExport<T>();

    return (
        <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={() => exportExcel(rows, columns, fileName)}>
                Excel
            </button>

            <button className="btn btn-outline-success btn-sm" onClick={() => exportCSV(rows, columns, fileName)}>
                CSV
            </button>

            <button className="btn btn-danger btn-sm" onClick={() => exportPDF(rows, columns, fileName)}>
                PDF
            </button>
        </div>
    );
}
