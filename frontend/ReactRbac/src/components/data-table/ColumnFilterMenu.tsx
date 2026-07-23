import { useState, useRef, useEffect } from "react";
import { Filter, Search } from "lucide-react";

export function ColumnFilterMenu() {
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

    return (
        <div className="position-relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            <div 
                className="text-muted d-flex align-items-center justify-content-center hover-bg p-1 rounded" 
                style={{ cursor: "pointer", width: 24, height: 24 }}
                onClick={() => setIsOpen(!isOpen)}
                title="Filter"
            >
                <Filter size={14} />
            </div>

            {isOpen && (
                <div 
                    className="dropdown-menu show p-2 shadow-sm border"
                    style={{ position: "absolute", top: "100%", right: 0, zIndex: 1050, width: 220, fontSize: "0.875rem" }}
                >
                    <div className="position-relative mb-2">
                        <Search size={14} className="position-absolute text-muted" style={{ left: 8, top: 8 }} />
                        <input 
                            type="text" 
                            className="form-control form-control-sm ps-4" 
                            placeholder="Search..." 
                        />
                    </div>
                    <div style={{ maxHeight: 150, overflowY: "auto" }} className="px-1">
                        <div className="form-check mb-1">
                            <input className="form-check-input" type="checkbox" id="selectAll" defaultChecked />
                            <label className="form-check-label" htmlFor="selectAll">(Select All)</label>
                        </div>
                        <div className="form-check mb-1">
                            <input className="form-check-input" type="checkbox" id="item1" defaultChecked />
                            <label className="form-check-label" htmlFor="item1">Item 1</label>
                        </div>
                        <div className="form-check mb-1">
                            <input className="form-check-input" type="checkbox" id="item2" defaultChecked />
                            <label className="form-check-label" htmlFor="item2">Item 2</label>
                        </div>
                        <div className="form-check mb-1">
                            <input className="form-check-input" type="checkbox" id="item3" defaultChecked />
                            <label className="form-check-label" htmlFor="item3">Item 3</label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
