import { useState, useEffect } from "react";
import type { ColumnDef } from "../types";

export function useColumnResizing<T>(columns: ColumnDef<T>[], storageKey: string | null) {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
        if (storageKey) {
            const saved = localStorage.getItem(`${storageKey}-widths`);
            if (saved) return JSON.parse(saved);
        }
        return Object.fromEntries(columns.map((col) => [col.id, col.width ?? 150]));
    });

    useEffect(() => {
        if (storageKey) localStorage.setItem(`${storageKey}-widths`, JSON.stringify(columnWidths));
    }, [columnWidths, storageKey]);

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
            startWidth: columnWidths[columnId] || 150,
        });
    };

    useEffect(() => {
        if (!resizeState) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - resizeState.startX;
            const col = columns.find(c => c.id === resizeState.columnId);
            const minW = col?.minWidth ?? 50;
            const maxW = col?.maxWidth ?? 1000;
            const newWidth = Math.max(minW, Math.min(maxW, resizeState.startWidth + deltaX));

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

    return {
        columnWidths,
        handleResizeStart,
    };
}
