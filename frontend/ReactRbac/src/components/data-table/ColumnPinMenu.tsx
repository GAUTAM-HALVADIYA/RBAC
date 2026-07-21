import { Pin } from "lucide-react";
import type { ColumnPinningState } from "./types";
import { useState, useRef, useEffect } from "react";

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

    const pinLeft = () => {
        onColumnPinningChange({
            left: [...columnPinning.left.filter(id => id !== columnId), columnId],
            right: columnPinning.right.filter(id => id !== columnId),
        });
        setIsOpen(false);
    };

    const pinRight = () => {
        onColumnPinningChange({
            left: columnPinning.left.filter(id => id !== columnId),
            right: [...columnPinning.right.filter(id => id !== columnId), columnId],
        });
        setIsOpen(false);
    };

    const unpin = () => {
        onColumnPinningChange({
            left: columnPinning.left.filter(id => id !== columnId),
            right: columnPinning.right.filter(id => id !== columnId),
        });
        setIsOpen(false);
    };

    return (
        <div className="dropdown position-relative" ref={dropdownRef}>
            <button
                className="btn btn-sm btn-light dropdown-toggle"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <Pin size={16}/>
            </button>

            {isOpen && (
                <ul className="dropdown-menu show position-absolute mt-1" style={{ zIndex: 1050 }}>
                    <li>
                        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); pinLeft(); }}>
                            Pin Left
                        </button>
                    </li>

                    <li>
                        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); pinRight(); }}>
                            Pin Right
                        </button>
                    </li>

                    <li>
                        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); unpin(); }}>
                            No Pin
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}