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

    width?: number;
    minWidth?: number;
    maxWidth?: number;
};
