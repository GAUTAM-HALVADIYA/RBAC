import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortingState {
    column: string | null;
    direction: SortDirection;
}

export type ColumnDef<T> = {
    id: string;
    header: string;

    accessorFn?: (row: T) => ReactNode;
    cell?: (props: { row: { original: T } }) => ReactNode;

    enableSorting?: boolean;
    enableEditing?: boolean;

    width?: number;
    minWidth?: number;
    maxWidth?: number;

    exportValue?: (row: T) => string | number | boolean;
    enableExport?: boolean;
};

export type PinDirection = "left" | "right" | null;

export interface ColumnPinningState {
    left: string[];
    right: string[];
}


export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    maxHeight?: string;
    isLoading?: boolean;

    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    onCellEdit?: (rowIndex: number, columnId: string, value: string) => void;

    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: T[]) => void;

    enableRowReordering?: boolean;
    onRowReorder?: (newData: T[]) => void;

    renderExpandedRow?: (row: T) => ReactNode;

    getRowId?: (row: T) => string;

    tableId?: string;

    columnPinning: ColumnPinningState;
    onColumnPinningChange: (value: ColumnPinningState) => void;
    
};

export interface ExportColumn<T> {
    id: string;
    header: string;
    accessorFn?: (row: T) => React.ReactNode;
}

