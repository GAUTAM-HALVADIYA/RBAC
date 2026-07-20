import { useState, useEffect } from "react";
import type { ColumnDef } from "../types";

export function useColumnOrdering<T>(columns: ColumnDef<T>[], storageKey: string | null) {
    const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(() => {
        if (storageKey) {
            const saved = localStorage.getItem(`${storageKey}-order`);
            if (saved) return JSON.parse(saved);
        }
        return columns.map((col) => col.id);
    });

    useEffect(() => {
        if (storageKey) localStorage.setItem(`${storageKey}-order`, JSON.stringify(orderedColumnIds));
    }, [orderedColumnIds, storageKey]);

    useEffect(() => {
        setOrderedColumnIds((prev) => {
            const newColumnIds = columns.map((c) => c.id);
            const existingOrdered = prev.filter((id) => newColumnIds.includes(id));
            const missing = newColumnIds.filter((id) => !existingOrdered.includes(id));
            return [...existingOrdered, ...missing];
        });
    }, [columns]);

    const orderedColumns = orderedColumnIds
        .map((id) => columns.find((c) => c.id === id))
        .filter((col): col is ColumnDef<T> => col !== undefined);

    const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

    const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
        setDraggedColumnId(columnId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", columnId);
    };

    const handleColumnDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
        e.preventDefault();
        if (!draggedColumnId || draggedColumnId === targetColumnId) return;

        setOrderedColumnIds((prev) => {
            const oldIndex = prev.indexOf(draggedColumnId);
            const newIndex = prev.indexOf(targetColumnId);
            const newOrder = [...prev];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, draggedColumnId);
            return newOrder;
        });
        setDraggedColumnId(null);
    };

    const handleColumnDragEnd = () => {
        setDraggedColumnId(null);
    };

    return {
        orderedColumns,
        draggedColumnId,
        handleColumnDragStart,
        handleColumnDragOver,
        handleColumnDrop,
        handleColumnDragEnd,
    };
}
