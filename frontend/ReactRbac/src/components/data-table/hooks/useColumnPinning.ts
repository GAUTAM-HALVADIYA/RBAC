import { useState } from "react";
import type { ColumnPinningState } from "../types";

export function useColumnPinning() {
    const [columnPinning, setColumnPinning] =
        useState<ColumnPinningState>({
            left: [],
            right: [],
        });

    return {
        columnPinning,
        setColumnPinning,
    };
}