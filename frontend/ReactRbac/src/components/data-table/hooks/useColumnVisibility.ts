import { useState, useEffect, useRef } from "react";
import type { ColumnDef } from "../types";

export function useColumnVisibility<T>(columns: ColumnDef<T>[], storageKey: string | null) {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        if (storageKey) {
            const saved = localStorage.getItem(`${storageKey}-visibility`);
            if (saved) return JSON.parse(saved);
        }
        return Object.fromEntries(columns.map((c) => [c.id, true]));
    });

    useEffect(() => {
        if (storageKey) localStorage.setItem(`${storageKey}-visibility`, JSON.stringify(columnVisibility));
    }, [columnVisibility, storageKey]);

    useEffect(() => {
        setColumnVisibility((prev) => {
            const next = { ...prev };
            columns.forEach((c) => {
                if (next[c.id] === undefined) {
                    next[c.id] = true;
                }
            });
            return next;
        });
    }, [columns]);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleColumnVisibility = (columnId: string) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }));
    };

    const toggleAllColumns = (isChecked: boolean) => {
        setColumnVisibility(Object.fromEntries(columns.map(c => [c.id, isChecked])));
    };

    return {
        columnVisibility,
        showDropdown,
        setShowDropdown,
        dropdownRef,
        toggleColumnVisibility,
        toggleAllColumns,
    };
}
