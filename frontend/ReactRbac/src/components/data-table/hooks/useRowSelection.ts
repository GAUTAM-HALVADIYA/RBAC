import { useMemo, useState } from "react";

export function useRowSelection<T>(
    localData: T[],
    getRowId?: (row: T) => string,
    onRowSelectionChange?: (selectedRows: T[]) => void,
) {
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

    const selectedRows = useMemo(() => {
        return localData.filter((row) => {
            const id = getRowId
                ? getRowId(row)
                : String((row as any)._id || (row as any).id);

            return selectedRowIds.has(id);
        });
    }, [localData, selectedRowIds, getRowId]);

    const toggleAllRows = (checked: boolean) => {
        if (checked) {
            const allIds = localData.map((row) =>
                getRowId
                    ? getRowId(row)
                    : String((row as any)._id || (row as any).id),
            );

            const newSet = new Set(allIds);

            setSelectedRowIds(newSet);

            onRowSelectionChange?.(localData);
        } else {
            setSelectedRowIds(new Set());

            onRowSelectionChange?.([]);
        }
    };

    const toggleRow = (row: T, checked: boolean) => {
        const id = getRowId
            ? getRowId(row)
            : String((row as any)._id || (row as any).id);

        const newSet = new Set(selectedRowIds);

        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }

        setSelectedRowIds(newSet);

        const rows = localData.filter((r) => {
            const rId = getRowId
                ? getRowId(r)
                : String((r as any)._id || (r as any).id);

            return newSet.has(rId);
        });

        onRowSelectionChange?.(rows);
    };

    return {
        selectedRowIds,
        selectedRows,
        toggleRow,
        toggleAllRows,
    };
}