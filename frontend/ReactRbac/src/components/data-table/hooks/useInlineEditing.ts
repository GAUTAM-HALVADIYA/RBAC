import { useState } from "react";

export function useInlineEditing() {
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
    const [editValue, setEditValue] = useState("");

    const startEditing = (rowIndex: number, columnId: string, initialValue: string) => {
        setEditingCell({ rowIndex, columnId });
        setEditValue(initialValue);
    };

    const stopEditing = () => {
        setEditingCell(null);
    };

    return {
        editingCell,
        editValue,
        setEditValue,
        startEditing,
        stopEditing,
    };
}
