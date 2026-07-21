import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ColumnDef } from "../types";

export function useExport<T>() {

    function exportPDF(
    rows: T[],
    columns: ColumnDef<T>[],
    filename = "table",
) {
    const doc = new jsPDF();

    const headers = columns
        .filter((c) => c.enableExport !== false)
        .map((c) => c.header);

    const body = rows.map((row) =>
        columns
            .filter((c) => c.enableExport !== false)
            .map((c) => {
                if (c.exportValue) {
                    return c.exportValue(row);
                }

                if (c.accessorFn) {
                    return c.accessorFn(row);
                }

                return "";
            }),
    );

    autoTable(doc, {
        head: [headers],
        body,
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
        },
    });

    doc.save(`${filename}.pdf`);
}


    function exportCSV(
        rows: T[],
        columns: ColumnDef<T>[],
        filename = "table"
    ) {
        const exportableColumns = columns.filter((c) => c.enableExport !== false);
        const data = rows.map((row) => {
            const obj: Record<string, any> = {};

            exportableColumns.forEach((col) => {
                if (col.exportValue) {
                    obj[col.header] = col.exportValue(row);
                } else if (col.accessorFn) {
                    obj[col.header] = col.accessorFn(row);
                } else {
                    obj[col.header] = "";
                }
            });

            return obj;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        XLSX.writeFile(workbook, `${filename}.csv`);
    }

    function exportExcel(
        rows: T[],
        columns: ColumnDef<T>[],
        filename = "table"
    ) {
        const exportableColumns = columns.filter((c) => c.enableExport !== false);
        const data = rows.map((row) => {
            const obj: Record<string, any> = {};

            exportableColumns.forEach((col) => {
                if (col.exportValue) {
                    obj[col.header] = col.exportValue(row);
                } else if (col.accessorFn) {
                    obj[col.header] = col.accessorFn(row);
                } else {
                    obj[col.header] = "";
                }
            });

            return obj;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        XLSX.writeFile(workbook, `${filename}.xlsx`);
    }

    return {
        exportCSV,
        exportExcel,
        exportPDF
    };
}