import { type ReactNode } from "react";
import { getNextSorting } from "./sorting";
import type { DataTableProps } from "./types";
import { ArrowUpDownIcon, GripVertical, SortAscIcon, SortDescIcon, Settings2, ChevronRight, ChevronDown, GripHorizontal } from "lucide-react";
import React from "react";
import { useColumnOrdering } from "./hooks/useColumnOrdering";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useColumnResizing } from "./hooks/useColumnResizing";
import { useRowReordering } from "./hooks/useRowReordering";
import { useRowSelection } from "./hooks/useRowSelection";
import { useRowExpansion } from "./hooks/useRowExpansion";
import { useInlineEditing } from "./hooks/useInlineEditing";
import { ExportMenu } from "./ExportMenu";
import { ColumnPinMenu } from "./ColumnPinMenu";
import { ColumnVisibilityMenu } from "./ColumnVisibilityMenu";
import { Pagination } from "./Pagination";

export function DataTable<T>(props: DataTableProps<T>) {
    const {
        data,
        columns,
        maxHeight = "550px",
        isLoading,
        onCellEdit,
        tableId,
    } = props;
    const storageKey = tableId ? `datatable-state-${tableId}` : null;

    const { expandedRowIds, toggleRowExpanded } = useRowExpansion();

    const { localData, draggedRowIndex, handleRowDragStart, handleRowDragOver, handleRowDragEnd } = useRowReordering(
        data,
        props.enableRowReordering,
        props.enableRowReordering ? props.onRowReorder : undefined,
    );

    const { selectedRowIds, toggleAllRows, toggleRow } = useRowSelection(
        localData, 
        props.enableRowSelection ? props.getRowId : undefined, 
        props.enableRowSelection ? props.onRowSelectionChange : undefined
    );

    const { editingCell, editValue, setEditValue, startEditing, stopEditing } = useInlineEditing();

    const handleSort = (column: string) => {
        if (props.enableSorting) {
            props.onSortingChange(getNextSorting(props.sorting, column));
        }
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

    const activeColumns = props.enableColumnVisibility 
        ? orderedColumns.filter((col) => columnVisibility[col.id] !== false)
        : orderedColumns;

    const leftPinnedColumns = props.enableColumnPinning 
        ? activeColumns.filter((col) => props.columnPinning.left.includes(col.id))
        : [];

    const rightPinnedColumns = props.enableColumnPinning
        ? activeColumns.filter((col) => props.columnPinning.right.includes(col.id))
        : [];

    const centerColumns = activeColumns.filter(
        (col) => !leftPinnedColumns.includes(col) && !rightPinnedColumns.includes(col)
    );

    const finalColumns = [...leftPinnedColumns, ...centerColumns, ...rightPinnedColumns];

    const leftOffsets: Record<string, number> = {};

    let leftOffset = 0;

    leftPinnedColumns.forEach((col) => {
        leftOffsets[col.id] = leftOffset;

        leftOffset += columnWidths[col.id] ?? 150;
    });

    const rightOffsets: Record<string, number> = {};

    let rightOffset = 0;

    [...rightPinnedColumns].reverse().forEach((col) => {
        rightOffsets[col.id] = rightOffset;

        rightOffset += columnWidths[col.id] ?? 150;
    });

    const selectedRows = localData.filter((row) => {
        if (!props.enableRowSelection) return false;
        const id = props.getRowId ? props.getRowId(row) : String((row as any)._id || (row as any).id);

        return selectedRowIds.has(id);
    });

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-end" ref={dropdownRef}>
                {props.enableExport && (
                    <ExportMenu rows={selectedRows.length > 0 ? selectedRows : localData} columns={finalColumns} fileName={props.exportFileName} />
                )}
                {props.enableColumnVisibility && (
                    <ColumnVisibilityMenu
                        columns={columns}
                        columnVisibility={columnVisibility}
                        toggleColumnVisibility={toggleColumnVisibility}
                        showDropdown={showColumnToggle}
                        setShowDropdown={setShowColumnToggle}
                        dropdownRef={dropdownRef}
                    />
                )}
            </div>
            <div className="table-responsive" style={{ maxHeight, overflowY: "auto" }}>
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
                            {props.enableRowExpansion && (
                                <th style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }}></th>
                            )}
                            {props.enableRowReordering && (
                                <th style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }}></th>
                            )}
                            {props.enableRowSelection && (
                                <th
                                    style={{ width: 36, minWidth: 36, maxWidth: 36, borderBottom: "2px solid #dee2e6" }}
                                    className="align-middle text-center py-3"
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                            localData.length > 0 &&
                                            localData.every((row) =>
                                                selectedRowIds.has(
                                                    props.getRowId ? props.getRowId(row) : String((row as any)._id || (row as any).id),
                                                ),
                                            )
                                        }
                                        onChange={(e) => toggleAllRows(e.target.checked)}
                                    />
                                </th>
                            )}
                            {finalColumns.map((col) => (
                                <th
                                    key={col.id}
                                    className="text-muted fw-bold small text-uppercase py-3 px-3"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, col.id)}
                                    onDragOver={(e) => handleDragOver(e)}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        backgroundColor: draggedColumnId === col.id ? "#f8f9fa" : "#fff",
                                        opacity: draggedColumnId === col.id ? 0.5 : 1,
                                        borderBottom: "2px solid #dee2e6",
                                        cursor: col.enableSorting ? "pointer" : "grab",
                                        userSelect: "none",
                                        width: columnWidths[col.id],
                                        minWidth: columnWidths[col.id],
                                        maxWidth: columnWidths[col.id],
                                        position:
                                            (props.enableColumnPinning && (props.columnPinning.left.includes(col.id) || props.columnPinning.right.includes(col.id)))
                                                ? "sticky"
                                                : "relative",

                                        left: (props.enableColumnPinning && props.columnPinning.left.includes(col.id)) ? leftOffsets[col.id] : undefined,

                                        right: (props.enableColumnPinning && props.columnPinning.right.includes(col.id)) ? rightOffsets[col.id] : undefined,

                                        zIndex: 0,
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div
                                            className="d-flex align-items-center gap-2"
                                            onClick={() => {
                                                if (col.enableSorting) {
                                                    handleSort(col.id);
                                                }
                                            }}
                                        >
                                            {col.header}

                                            {col.enableSorting && props.enableSorting && (
                                                <>
                                                    {props.sorting.column !== col.id && <ArrowUpDownIcon />}

                                                    {props.sorting.column === col.id && props.sorting.direction === "asc" && <SortAscIcon />}

                                                    {props.sorting.column === col.id && props.sorting.direction === "desc" && <SortDescIcon />}
                                                </>
                                            )}
                                        </div>

                                        <div className="d-flex align-items-center gap-1">
                                            {props.enableColumnPinning && (
                                                <ColumnPinMenu
                                                    columnId={col.id}
                                                    columnPinning={props.columnPinning}
                                                    onColumnPinningChange={props.onColumnPinningChange}
                                                />
                                            )}

                                            <GripVertical
                                                className="resize-handle"
                                                onMouseDown={(e) => handleResizeStart(e, col.id)}
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`skeleton-${i}`}>
                                    {props.enableRowExpansion && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 40 }}>
                                            <span
                                                className="placeholder bg-secondary opacity-25 rounded w-100"
                                                style={{ height: "18px", display: "inline-block" }}
                                            ></span>
                                        </td>
                                    )}
                                    {props.enableRowReordering && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 36 }}>
                                            <span
                                                className="placeholder bg-secondary opacity-25 rounded w-100"
                                                style={{ height: "18px", display: "inline-block" }}
                                            ></span>
                                        </td>
                                    )}
                                    {props.enableRowSelection && (
                                        <td className="align-middle p-3 placeholder-glow" style={{ width: 36 }}>
                                            <span
                                                className="placeholder bg-secondary opacity-25 rounded w-100"
                                                style={{ height: "18px", display: "inline-block" }}
                                            ></span>
                                        </td>
                                    )}
                                    {finalColumns.map((col) => (
                                        <td key={`skeleton-col-${col.id}`} className="align-middle p-3 placeholder-glow">
                                            <span
                                                className="placeholder bg-secondary opacity-25 rounded"
                                                style={{
                                                    height: "18px",
                                                    width: `${Math.floor(Math.random() * 40) + 40}%`,
                                                    display: "inline-block",
                                                }}
                                            ></span>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : localData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        finalColumns.length +
                                        (props.enableRowReordering ? 1 : 0) +
                                        (props.enableRowSelection ? 1 : 0) +
                                        (props.enableRowExpansion ? 1 : 0)
                                    }
                                    className="text-center py-4 text-muted"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            localData.map((row, rowIndex) => {
                                const rowId = props.getRowId ? props.getRowId(row) : String((row as any)._id || (row as any).id);
                                const isExpanded = expandedRowIds.has(rowId);

                                return (
                                   <React.Fragment key={rowIndex}>
                                  
                                        <tr
                                            draggable={props.enableRowReordering}
                                            onDragStart={(e) => handleRowDragStart(e, rowIndex)}
                                            onDragOver={(e) => handleRowDragOver(e, rowIndex)}
                                            onDragEnd={handleRowDragEnd}
                                            style={{
                                                opacity: draggedRowIndex === rowIndex ? 0.5 : 1,
                                                backgroundColor: draggedRowIndex === rowIndex ? "#f8f9fa" : "inherit",
                                            }}
                                        >
                                            {props.enableRowExpansion && (
                                                <td
                                                    className="align-middle text-center"
                                                    style={{ width: 36, cursor: "pointer" }}
                                                    onClick={() => toggleRowExpanded(rowId)}
                                                >
                                                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                </td>
                                            )}
                                            {props.enableRowReordering && (
                                                <td
                                                    className="align-middle text-center text-muted"
                                                    style={{ cursor: "grab", width: 36 }}
                                                >
                                                    <GripHorizontal size={16} />
                                                </td>
                                            )}
                                            {props.enableRowSelection && (
                                                <td className="align-middle text-center" style={{ width: 36 }}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedRowIds.has(
                                                            props.getRowId ? props.getRowId(row) : String((row as any)._id || (row as any).id),
                                                        )}
                                                        onChange={(e) => toggleRow(row, e.target.checked)}
                                                    />
                                                </td>
                                            )}
                                            {finalColumns.map((col) => {
                                                const isEditing =
                                                    editingCell?.rowIndex === rowIndex && editingCell?.columnId === col.id;

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
                                                                if (e.key === "Enter") {
                                                                    if (onCellEdit) {
                                                                        onCellEdit(rowIndex, col.id, editValue);
                                                                    }
                                                                    stopEditing();
                                                                } else if (e.key === "Escape") {
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
                                                            whiteSpace: "nowrap",
                                                            position:
                                                                (props.enableColumnPinning && (props.columnPinning.left.includes(col.id) || props.columnPinning.right.includes(col.id)))
                                                                    ? "sticky"
                                                                    : "relative",

                                                            left: (props.enableColumnPinning && props.columnPinning.left.includes(col.id))
                                                                ? leftOffsets[col.id]
                                                                : undefined,

                                                            right: (props.enableColumnPinning && props.columnPinning.right.includes(col.id))
                                                                ? rightOffsets[col.id]
                                                                : undefined,

                                                            background: "#fff",

                                                            zIndex: 0
                                                        }}
                                                        onDoubleClick={() => {
                                                            if (col.enableEditing) {
                                                                let val = "";
                                                                if (col.accessorFn) {
                                                                    const res = col.accessorFn(row);
                                                                    val =
                                                                        typeof res === "string" || typeof res === "number"
                                                                            ? String(res)
                                                                            : "";
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
                                        {isExpanded && props.enableRowExpansion && (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        finalColumns.length +
                                                        (props.enableRowReordering ? 1 : 0) +
                                                        (props.enableRowSelection ? 1 : 0) +
                                                        1
                                                    }
                                                    className="p-0 border-0"
                                                >
                                                    {props.renderExpandedRow(row)}
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
            {props.enablePagination && (
                <Pagination {...(props as any)} />
            )}
        </div>
    );
}
