import { useState } from "react";

export function useRowSelection<T>(
    localData: T[],
    getRowId?: (row: T) => string,
    onRowSelectionChange?: (selectedRows: T[]) => void,
) {
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
        new Set(),
    );

    const toggleAllRows = (checked: boolean) => {
        if (checked) {
            const allIds = localData.map((r) =>
                getRowId
                    ? getRowId(r)
                    : String((r as any)._id || (r as any).id),
            );
            const newSet = new Set(allIds);
            setSelectedRowIds(newSet);
            if (onRowSelectionChange) onRowSelectionChange(localData);
        } else {
            setSelectedRowIds(new Set());
            if (onRowSelectionChange) onRowSelectionChange([]);
        }
    };

    const toggleRow = (row: T, checked: boolean) => {
        const id = getRowId
            ? getRowId(row)
            : String((row as any)._id || (row as any).id);
        const newSet = new Set(selectedRowIds);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedRowIds(newSet);

        if (onRowSelectionChange) {
            const selectedRows = localData.filter((r) => {
                const rId = getRowId
                    ? getRowId(r)
                    : String((r as any)._id || (r as any).id);
                return newSet.has(rId);
            });
            onRowSelectionChange(selectedRows);
        }
    };

    return {
        selectedRowIds,
        toggleAllRows,
        toggleRow,
    };
}
