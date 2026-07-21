import { Settings2 } from "lucide-react";
import type { ColumnDef } from "./types";
import type { RefObject } from "react";

type Props<T> = {
    columns: ColumnDef<T>[];
    columnVisibility: Record<string, boolean>;
    toggleColumnVisibility: (columnId: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    dropdownRef: RefObject<HTMLDivElement>;
};

export function ColumnVisibilityMenu<T>({
    columns,
    columnVisibility,
    toggleColumnVisibility,
    showDropdown,
    setShowDropdown,
    dropdownRef,
}: Props<T>) {
    return (
        <div className="dropdown position-relative ms-2" ref={dropdownRef}>
            <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Settings2 size={16} /> Columns
            </button>
            {showDropdown && (
                <div
                    className="dropdown-menu show position-absolute end-0 mt-1 shadow-sm p-2"
                    style={{ zIndex: 1050, minWidth: "200px" }}
                >
                    {columns.map((col) => (
                        <div key={col.id} className="form-check mb-1">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`col-toggle-${col.id}`}
                                checked={columnVisibility[col.id] !== false}
                                onChange={() => toggleColumnVisibility(col.id)}
                            />
                            <label
                                className="form-check-label user-select-none"
                                htmlFor={`col-toggle-${col.id}`}
                                style={{ cursor: "pointer" }}
                            >
                                {col.header}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
