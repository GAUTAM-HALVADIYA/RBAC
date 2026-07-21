import { useExport } from "./hooks/useExport";
import type { ColumnDef } from "./types";

type Props<T> = {
    rows: T[];
    columns: ColumnDef<T>[];
};

export function ExportMenu<T>({ rows, columns }: Props<T>) {
    const { exportExcel, exportCSV, exportPDF } = useExport<T>();

    return (
        <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={() => exportExcel(rows, columns, "table-data")}>
                Excel
            </button>

            <button className="btn btn-outline-success btn-sm" onClick={() => exportCSV(rows, columns, "table-data")}>
                CSV
            </button>

            <button className="btn btn-danger btn-sm" onClick={() => exportPDF(rows, columns, "table-data")}>
                PDF
            </button>
        </div>
    );
}
