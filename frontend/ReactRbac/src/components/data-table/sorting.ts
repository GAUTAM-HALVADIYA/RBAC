import type { SortingState } from "./types";

export function getNextSorting(current: SortingState, column: string): SortingState {
    if (current.column !== column) {
        return {
            column,
            direction: "asc",
        };
    }

    if (current.direction === "asc") {
        return {
            column,
            direction: "desc",
        };
    }

    if (current.direction === "desc") {
        return {
            column: null,
            direction: null,
        };
    }

    return {
        column,
        direction: "asc",
    };
}
