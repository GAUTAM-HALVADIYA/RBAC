import { useState, useEffect } from "react";

export function useRowReordering<T>(
    initialData: T[],
    enableRowReordering?: boolean,
    onRowReorder?: (newData: T[]) => void
) {
    const [localData, setLocalData] = useState<T[]>(initialData);
    
    useEffect(() => {
        setLocalData(initialData);
    }, [initialData]);

    const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);

    const handleRowDragStart = (e: React.DragEvent, index: number) => {
        if (!enableRowReordering) return;
        setDraggedRowIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleRowDragOver = (e: React.DragEvent, index: number) => {
        if (!enableRowReordering) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggedRowIndex === null || draggedRowIndex === index) return;
        
        setLocalData((prev) => {
            const newData = [...prev];
            const [movedRow] = newData.splice(draggedRowIndex, 1);
            newData.splice(index, 0, movedRow);
            setDraggedRowIndex(index);
            return newData;
        });
    };

    const handleRowDragEnd = () => {
        if (!enableRowReordering) return;
        setDraggedRowIndex(null);
        if (onRowReorder) {
            onRowReorder(localData);
        }
    };

    return {
        localData,
        draggedRowIndex,
        handleRowDragStart,
        handleRowDragOver,
        handleRowDragEnd,
    };
}
