import { useState } from "react";

export function useRowExpansion() {
    const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());
    
    const toggleRowExpanded = (rowId: string) => {
        setExpandedRowIds(prev => {
            const next = new Set(prev);
            if (next.has(rowId)) next.delete(rowId);
            else next.add(rowId);
            return next;
        });
    };

    return {
        expandedRowIds,
        toggleRowExpanded,
    };
}
