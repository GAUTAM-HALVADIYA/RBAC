import { useEffect, useState, type ReactNode } from "react";
import { getNextSorting } from "./sorting";
import type { SortingState, ColumnDef } from "./types";
import { ArrowUpDownIcon, GripVertical, SortAscIcon, SortDescIcon } from "lucide-react";

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    maxHeight?: string;

    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
};

export function DataTable<T>({ data, columns, maxHeight = "550px", sorting, onSortingChange }: DataTableProps<T>) {
    const handleSort = (column: string) => {
        onSortingChange(getNextSorting(sorting, column));
    };
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
        Object.fromEntries(columns.map((col) => [col.id, col.width ?? 150])),
    );

    const [resizeState, setResizeState] = useState<{
        columnId: string;
        startX: number;
        startWidth: number;
    } | null>(null);

    const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
        e.preventDefault();

        setResizeState({
            columnId,
            startX: e.clientX,  
            startWidth: columnWidths[columnId],
        });
    };

    useEffect(() => {
        if (!resizeState) return;

        const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - resizeState.startX;

            const column = columns.find((c) => c.id === resizeState.columnId);

            const minWidth = column?.minWidth ?? 80;
            const maxWidth = column?.maxWidth ?? Infinity;

            const newWidth = Math.min(Math.max(resizeState.startWidth + diff, minWidth), maxWidth);

            setColumnWidths((prev) => ({
                ...prev,
                [resizeState.columnId]: newWidth,
            }));
        };

        const handleMouseUp = () => {
            setResizeState(null);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [resizeState, columns]);

    return (
        <div className="table-responsive" style={{ maxHeight, overflowY: "auto" }}>
            <table className="table table-hover table-custom mb-0">
                <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className="text-muted fw-bold small text-uppercase py-3"
                                style={{
                                    backgroundColor: "#fff",
                                    borderBottom: "2px solid #dee2e6",
                                    cursor: col.enableSorting ? "pointer" : "default",
                                    userSelect: "none",
                                    width: columnWidths[col.id],
                                    minWidth: columnWidths[col.id],
                                    maxWidth: columnWidths[col.id],
                                }}
                            >
                                <div
                                    className="d-flex align-items-center gap-2"
                                    onClick={() => {
                                        if (col.enableSorting) {
                                            handleSort(col.id);
                                        }
                                    }}
                                >
                                    {col.header}

                                    {col.enableSorting && (
                                        <>
                                            {sorting.column !== col.id && <ArrowUpDownIcon />}

                                            {sorting.column === col.id && sorting.direction === "asc" && <SortAscIcon />}

                                            {sorting.column === col.id && sorting.direction === "desc" && <SortDescIcon />}
                                        </>
                                    )}
                                </div>
                                <GripVertical className="resize-handle" onMouseDown={(e) => handleResizeStart(e, col.id)} size={18} />
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
                                        <td
                                            key={col.id}
                                            className="align-middle"
                                            style={{
                                                width: columnWidths[col.id],
                                            }}
                                        >
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
