import { type ReactNode } from "react";
import { getNextSorting } from "./sorting";
import type {DataTableProps } from "./types";
import {
    ArrowUpDownIcon,
    GripVertical,
    SortAscIcon,
    SortDescIcon,
    Settings2,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import React from "react";
import { useColumnOrdering } from "./hooks/useColumnOrdering";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useColumnResizing } from "./hooks/useColumnResizing";
import { useRowReordering } from "./hooks/useRowReordering";
import { useRowSelection } from "./hooks/useRowSelection";
import { useRowExpansion } from "./hooks/useRowExpansion";
import { useInlineEditing } from "./hooks/useInlineEditing";

export function DataTable<T>({
    data,
    columns,
    maxHeight = "550px",
    sorting,
    onSortingChange,
    isLoading,
    onCellEdit,
    enableRowSelection,
    onRowSelectionChange,
    enableRowReordering,
    onRowReorder,
    renderExpandedRow,
    getRowId,
    tableId,
}: DataTableProps<T>) {
    const storageKey = tableId ? `datatable-state-${tableId}` : null;

    const { expandedRowIds, toggleRowExpanded } = useRowExpansion();

    const {
        localData,
        draggedRowIndex,
        handleRowDragStart,
        handleRowDragOver,
        handleRowDragEnd,
    } = useRowReordering(data, enableRowReordering, onRowReorder);

    const { selectedRowIds, toggleAllRows, toggleRow } = useRowSelection(localData, getRowId, onRowSelectionChange);

    const { editingCell, editValue, setEditValue, startEditing, stopEditing } = useInlineEditing();

    const handleSort = (column: string) => {
        onSortingChange(getNextSorting(sorting, column));
    };

    const {
        orderedColumns,
        draggedColumnId,
        handleColumnDragStart: handleDragStart,
        handleColumnDragOver: handleDragOver,
        handleColumnDrop: handleDrop,
        handleColumnDragEnd: handleDragEnd,
    } = useColumnOrdering(columns, storageKey);

    const {
        columnVisibility,
        showDropdown: showColumnToggle,
        setShowDropdown: setShowColumnToggle,
        dropdownRef,
        toggleColumnVisibility,
    } = useColumnVisibility(columns, storageKey);

    const { columnWidths, handleResizeStart } = useColumnResizing(columns, storageKey);

    const activeColumns = orderedColumns.filter((col) => columnVisibility[col.id] !== false);

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-end" ref={dropdownRef}>
                <div className="dropdown position-relative">
                    <button
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                        onClick={() => setShowColumnToggle(!showColumnToggle)}
                    >
                        <Settings2 size={16} /> Columns
                    </button>
                    {showColumnToggle && (
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
                                        checked={
                                            columnVisibility[col.id] !== false
                                        }
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
            </div>
            <div
                className="table-responsive"
                style={{ maxHeight, overflowY: "auto" }}
            >
                <table className="table table-hover table-custom mb-0">
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#fff",
                        }}
                    >
                        <tr>
                            {renderExpandedRow && (
                                <th style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }}></th>
                            )}
                            {enableRowReordering && (
                                <th style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }}></th>
                            )}
                            {enableRowSelection && (
                                <th style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }} className="align-middle text-center py-3">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input"
                                        checked={localData.length > 0 && localData.every(row => selectedRowIds.has(getRowId ? getRowId(row) : String((row as any)._id || (row as any).id)))}
                                        onChange={(e) => toggleAllRows(e.target.checked)}
                                    />
                                </th>
                            )}
                            {activeColumns.map((col) => (
                                <th
                                    key={col.id}
                                    className="text-muted fw-bold small text-uppercase py-3 px-3"
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, col.id)
                                    }
                                    onDragOver={(e) =>
                                        handleDragOver(e)
                                    }
                                    onDrop={(e) => handleDrop(e, col.id)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        backgroundColor:
                                            draggedColumnId === col.id
                                                ? "#f8f9fa"
                                                : "#fff",
                                        opacity:
                                            draggedColumnId === col.id
                                                ? 0.5
                                                : 1,
                                        borderBottom: "2px solid #dee2e6",
                                        cursor: col.enableSorting
                                            ? "pointer"
                                            : "grab",
                                        userSelect: "none",
                                        width: columnWidths[col.id],
                                        minWidth: columnWidths[col.id],
                                        maxWidth: columnWidths[col.id],
                                    }}
                                >
                                    <div
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => {
                                            if (col.enableSorting) {
                                                handleSort(col.id);
                                            }
                                        }}
                                    >
                                        {col.header}

                                        {col.enableSorting && (
                                            <>
                                                {sorting.column !== col.id && (
                                                    <ArrowUpDownIcon />
                                                )}

                                                {sorting.column === col.id &&
                                                    sorting.direction ===
                                                        "asc" && (
                                                        <SortAscIcon />
                                                    )}

                                                {sorting.column === col.id &&
                                                    sorting.direction ===
                                                        "desc" && (
                                                        <SortDescIcon />
                                                    )}
                                            </>
                                        )}
                                    </div>
                                    <GripVertical
                                        className="resize-handle"
                                        onMouseDown={(e) =>
                                            handleResizeStart(e, col.id)
                                        }
                                        size={18}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`skeleton-${i}`}>
                                    {renderExpandedRow && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 40 }}>
                                            <span className="placeholder bg-secondary opacity-25 rounded w-100" style={{ height: "18px", display: "inline-block" }}></span>
                                        </td>
                                    )}
                                    {enableRowReordering && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 36 }}>
                                            <span className="placeholder bg-secondary opacity-25 rounded w-100" style={{ height: "18px", display: "inline-block" }}></span>
                                        </td>
                                    )}
                                    {enableRowSelection && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 36 }}>
                                            <span className="placeholder bg-secondary opacity-25 rounded w-100" style={{ height: "18px", display: "inline-block" }}></span>
                                        </td>
                                    )}
                                    {activeColumns.map(col => (
                                        <td key={`skeleton-col-${col.id}`} className="align-middle p-3 placeholder-glow">
                                            <span className="placeholder bg-secondary opacity-25 rounded" style={{ height: "18px", width: `${Math.floor(Math.random() * 40) + 40}%`, display: "inline-block" }}></span>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : localData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={activeColumns.length + (enableRowReordering ? 1 : 0) + (enableRowSelection ? 1 : 0) + (renderExpandedRow ? 1 : 0)}
                                    className="text-center py-4 text-muted"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            localData.map((row, rowIndex) => {
                                const rowId = getRowId ? getRowId(row) : String((row as any)._id || (row as any).id);
                                const isExpanded = expandedRowIds.has(rowId);

                                return (
                                <React.Fragment key={rowId || rowIndex}>
                                    <tr 
                                        draggable={enableRowReordering}
                                        onDragStart={(e) => handleRowDragStart(e, rowIndex)}
                                        onDragOver={(e) => handleRowDragOver(e, rowIndex)}
                                        onDragEnd={handleRowDragEnd}
                                        style={{
                                            opacity: draggedRowIndex === rowIndex ? 0.5 : 1,
                                            backgroundColor: draggedRowIndex === rowIndex ? "#f8f9fa" : "inherit"
                                        }}
                                    >
                                        {renderExpandedRow && (
                                            <td 
                                                className="align-middle text-center" 
                                                style={{ width: 36, cursor: "pointer" }}
                                                onClick={() => toggleRowExpanded(rowId)}
                                            >
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </td>
                                        )}
                                        {enableRowReordering && (
                                        <td className="align-middle text-center text-muted" style={{ cursor: "grab", width: 36 }}>
                                            <GripVertical size={16} />
                                        </td>
                                    )}
                                    {enableRowSelection && (
                                        <td className="align-middle text-center" style={{ width: 36 }}>
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input"
                                                checked={selectedRowIds.has(getRowId ? getRowId(row) : String((row as any)._id || (row as any).id))}
                                                onChange={(e) => toggleRow(row, e.target.checked)}
                                            />
                                        </td>
                                    )}
                                    {activeColumns.map((col) => {
                                        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === col.id;
                                        
                                        let content: ReactNode = null;
                                        if (isEditing) {
                                            content = (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={editValue}
                                                    autoFocus
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => {
                                                        if (onCellEdit) {
                                                            onCellEdit(rowIndex, col.id, editValue);
                                                        }
                                                        stopEditing();
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (onCellEdit) {
                                                                onCellEdit(rowIndex, col.id, editValue);
                                                            }
                                                            stopEditing();
                                                        } else if (e.key === 'Escape') {
                                                            stopEditing();
                                                        }
                                                    }}
                                                />
                                            );
                                        } else if (col.cell) {
                                            content = col.cell({
                                                row: { original: row },
                                            });
                                        } else if (col.accessorFn) {
                                            content = col.accessorFn(row);
                                        }

                                        return (
                                            <td
                                                key={col.id}
                                                className="align-middle"
                                                style={{
                                                    width: columnWidths[col.id] || 150,
                                                    overflow: isEditing ? "visible" : "hidden",
                                                    textOverflow: isEditing ? "clip" : "ellipsis",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onDoubleClick={() => {
                                                    if (col.enableEditing) {
                                                        let val = "";
                                                        if (col.accessorFn) {
                                                            const res = col.accessorFn(row);
                                                            val = typeof res === "string" || typeof res === "number" ? String(res) : "";
                                                        } else {
                                                            val = String((row as any)[col.id] || "");
                                                        }
                                                        startEditing(rowIndex, col.id, val);
                                                    }
                                                }}
                                            >
                                                {content}
                                            </td>
                                        );
                                    })}
                                    </tr>
                                    {isExpanded && renderExpandedRow && (
                                        <tr>
                                            <td colSpan={activeColumns.length + (enableRowReordering ? 1 : 0) + (enableRowSelection ? 1 : 0) + 1} className="p-0 border-0">
                                                {renderExpandedRow(row)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
