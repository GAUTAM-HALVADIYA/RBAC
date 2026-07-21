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


export type BaseDataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    maxHeight?: string;
    isLoading?: boolean;
    tableId?: string;
    onCellEdit?: (rowIndex: number, columnId: string, value: string) => void;

    enableExport?: boolean;
    exportFileName?: string;
};

export type DataTableSortingProps =
    | { enableSorting?: false; sorting?: never; onSortingChange?: never }
    | { enableSorting: true; sorting: SortingState; onSortingChange: (sorting: SortingState) => void };

export type DataTableRowSelectionProps<T> =
    | { enableRowSelection?: false; onRowSelectionChange?: never; getRowId?: never }
    | { enableRowSelection: true; onRowSelectionChange?: (selectedRows: T[]) => void; getRowId?: (row: T) => string };

export type DataTableRowReorderingProps<T> =
    | { enableRowReordering?: false; onRowReorder?: never }
    | { enableRowReordering: true; onRowReorder: (newData: T[]) => void };

export type DataTableColumnPinningProps =
    | { enableColumnPinning?: false; columnPinning?: never; onColumnPinningChange?: never }
    | { enableColumnPinning: true; columnPinning: ColumnPinningState; onColumnPinningChange: (value: ColumnPinningState) => void };

export type DataTableColumnVisibilityProps =
    | { enableColumnVisibility?: false }
    | { enableColumnVisibility: true };

export type DataTableRowExpansionProps<T> =
    | { enableRowExpansion?: false; renderExpandedRow?: never }
    | { enableRowExpansion: true; renderExpandedRow: (row: T) => ReactNode };

export type DataTablePaginationProps =
    | {
          enablePagination?: false;
          page?: never;
          totalPages?: never;
          onPageChange?: never;
          maxVisiblePages?: never;
          showFirstLast?: never;
          showInfo?: never;
          totalRecords?: never;
          showPageSize?: never;
          pageSize?: never;
          pageSizeOptions?: never;
          onPageSizeChange?: never;
      }
    | ({
          enablePagination: true;
          page: number;
          totalPages: number;
          pageSize: number;
          onPageChange: (page: number) => void;
          maxVisiblePages?: number;
          showFirstLast?: boolean;
      } & (
          | { showInfo?: false; totalRecords?: undefined }
          | { showInfo: true; totalRecords: number }
      ) & (
          | { showPageSize?: false; pageSizeOptions?: undefined; onPageSizeChange?: undefined }
          | { showPageSize: true; pageSizeOptions: number[]; onPageSizeChange: (size: number) => void }
      ));

export type DataTableProps<T> = BaseDataTableProps<T> &
    DataTableSortingProps &
    DataTableRowSelectionProps<T> &
    DataTableRowReorderingProps<T> &
    DataTableColumnPinningProps &
    DataTableColumnVisibilityProps &
    DataTableRowExpansionProps<T> &
    DataTablePaginationProps;

export interface ExportColumn<T> {
    id: string;
    header: string;
    accessorFn?: (row: T) => React.ReactNode;
}

