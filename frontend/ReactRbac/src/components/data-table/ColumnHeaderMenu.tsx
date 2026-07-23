import { useState, useRef, useEffect } from "react";
import { MoreVertical, ArrowDownAZ, ArrowUpZA, X, Pin, PinOff } from "lucide-react";
import type { SortingState } from "./types";

interface ColumnHeaderMenuProps {
    columnId: string;
    enableSorting?: boolean;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    enableColumnPinning?: boolean;
    columnPinning: { left: string[]; right: string[] };
    onColumnPinningChange: (pinning: { left: string[]; right: string[] }) => void;
}

export function ColumnHeaderMenu({
    columnId,
    enableSorting,
    sorting,
    onSortingChange,
    enableColumnPinning,
    columnPinning,
    onColumnPinningChange
}: ColumnHeaderMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSortAsc = () => {
        onSortingChange({ column: columnId, direction: "asc" });
        setIsOpen(false);
    };

    const handleSortDesc = () => {
        onSortingChange({ column: columnId, direction: "desc" });
        setIsOpen(false);
    };

    const handleClearSort = () => {
        onSortingChange({ column: null, direction: null });
        setIsOpen(false);
    };

    const handlePin = (direction: 'left' | 'right' | null) => {
        const newLeft = columnPinning.left.filter(id => id !== columnId);
        const newRight = columnPinning.right.filter(id => id !== columnId);

        if (direction === 'left') newLeft.push(columnId);
        if (direction === 'right') newRight.push(columnId);

        onColumnPinningChange({ left: newLeft, right: newRight });
        setIsOpen(false);
    };

    const isSortedAsc = sorting.column === columnId && sorting.direction === "asc";
    const isSortedDesc = sorting.column === columnId && sorting.direction === "desc";
    
    const isPinnedLeft = columnPinning.left.includes(columnId);
    const isPinnedRight = columnPinning.right.includes(columnId);
    const isNotPinned = !isPinnedLeft && !isPinnedRight;

    return (
        <div className="position-relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            <div 
                className="text-muted d-flex align-items-center justify-content-center hover-bg p-1 rounded" 
                style={{ cursor: "pointer", width: 24, height: 24 }}
                onClick={() => setIsOpen(!isOpen)}
                title="Menu"
            >
                <MoreVertical size={16} />
            </div>

            {isOpen && (
                <div 
                    className="dropdown-menu show shadow-sm border"
                    style={{ position: "absolute", top: "100%", right: 0, zIndex: 1050, minWidth: 200, fontSize: "0.875rem" }}
                >
                    {enableSorting && (
                        <>
                            <button 
                                className={`dropdown-item d-flex align-items-center gap-2 ${isSortedAsc ? "active" : ""}`}
                                onClick={handleSortAsc}
                            >
                                <ArrowDownAZ size={14} /> Sort Ascending
                            </button>
                            <button 
                                className={`dropdown-item d-flex align-items-center gap-2 ${isSortedDesc ? "active" : ""}`}
                                onClick={handleSortDesc}
                            >
                                <ArrowUpZA size={14} /> Sort Descending
                            </button>
                            <button 
                                className="dropdown-item d-flex align-items-center gap-2"
                                onClick={handleClearSort}
                                disabled={sorting.column !== columnId}
                            >
                                <X size={14} /> Clear Sort
                            </button>
                        </>
                    )}

                    {enableSorting && enableColumnPinning && <hr className="dropdown-divider" />}

                    {enableColumnPinning && (
                        <>
                            <button 
                                className={`dropdown-item d-flex align-items-center gap-2 ${isPinnedLeft ? "active" : ""}`}
                                onClick={() => handlePin('left')}
                            >
                                <Pin size={14} style={{ transform: "rotate(-45deg)" }} /> Pin Left
                            </button>
                            <button 
                                className={`dropdown-item d-flex align-items-center gap-2 ${isPinnedRight ? "active" : ""}`}
                                onClick={() => handlePin('right')}
                            >
                                <Pin size={14} style={{ transform: "rotate(45deg)" }} /> Pin Right
                            </button>
                            <button 
                                className={`dropdown-item d-flex align-items-center gap-2 ${isNotPinned ? "active" : ""}`}
                                onClick={() => handlePin(null)}
                            >
                                <PinOff size={14} /> No Pin
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
