import { Pin } from "lucide-react";
import type { ColumnPinningState } from "./types";

type Props = {
    columnId: string;
    columnPinning: ColumnPinningState;
    onColumnPinningChange: (value: ColumnPinningState) => void;
};

export function ColumnPinMenu({
    columnId,
    columnPinning,
    onColumnPinningChange,
}: Props) {
    const pinLeft = () => {
        onColumnPinningChange({
            left: [...columnPinning.left.filter(id => id !== columnId), columnId],
            right: columnPinning.right.filter(id => id !== columnId),
        });
    };

    const pinRight = () => {
        onColumnPinningChange({
            left: columnPinning.left.filter(id => id !== columnId),
            right: [...columnPinning.right.filter(id => id !== columnId), columnId],
        });
    };

    const unpin = () => {
        onColumnPinningChange({
            left: columnPinning.left.filter(id => id !== columnId),
            right: columnPinning.right.filter(id => id !== columnId),
        });
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-sm btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
            >
                <Pin size={16}/>
            </button>

            <ul className="dropdown-menu">
                <li>
                    <button className="dropdown-item" onClick={pinLeft}>
                        Pin Left
                    </button>
                </li>

                <li>
                    <button className="dropdown-item" onClick={pinRight}>
                        Pin Right
                    </button>
                </li>

                <li>
                    <button className="dropdown-item" onClick={unpin}>
                        No Pin
                    </button>
                </li>
            </ul>
        </div>
    );
}