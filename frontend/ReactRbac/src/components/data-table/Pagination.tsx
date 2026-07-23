import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PageSizeProps =
    | {
          showPageSize?: false;
      }
    | {
          showPageSize: true;
          pageSize: number;
          pageSizeOptions: number[];
          onPageSizeChange: (size: number) => void;
      };
type InfoProps =
    | {
          showInfo?: false;
      }
    | {
          showInfo: true;
          totalRecords: number;
          pageSize: number;
      };
interface BasePaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    maxVisiblePages?: number;
    showFirstLast?: boolean;
}
type PaginationProps = BasePaginationProps & PageSizeProps & InfoProps;

export function Pagination(props: PaginationProps) {
    const { page, totalPages, onPageChange, maxVisiblePages = 3, showFirstLast = false } = props;

    // if (totalPages <= 1) return null;

    const mid = Math.floor(maxVisiblePages / 2);

    const startPage = Math.max(1, Math.min(page - mid, totalPages - maxVisiblePages + 1));
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    let startRecord = 0;
    let endRecord = 0;

    if (props.showInfo) {
        startRecord = (page - 1) * props.pageSize + 1;
        endRecord = Math.min(page * props.pageSize, props.totalRecords);
    }

    const handlePrev = () => {
        if (page === 1) return;
        onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page === totalPages) return;
        onPageChange(page + 1);
    };


    return (
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
            {props.showInfo && (
                <span>
                    Showing {startRecord} - {endRecord} of {props.totalRecords}
                </span>
            )}

            {props.showPageSize && (
                <div className="d-flex align-items-center gap-2">
                    <label htmlFor="pageSizeSelect" className="text-secondary small text-nowrap mb-0">
                        Rows per page:
                    </label>

                    <select
                        id="pageSizeSelect"
                        className="form-select form-select-sm w-auto"
                        value={props.pageSize}
                        onChange={(e) => props.onPageSizeChange(Number(e.target.value))}
                    >
                        {props.pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="d-flex align-items-center gap-1">
                {showFirstLast && (
                    <button
                        className="btn btn-sm d-flex align-items-center justify-content-center border-0 rounded-circle"
                        style={{ width: 32, height: 32, padding: 0, color: page === 1 ? "var(--bs-tertiary-color)" : "var(--bs-secondary-color)", background: "transparent" }}
                        disabled={page === 1}
                        onClick={() => onPageChange(1)}
                    >
                        <ChevronsLeft size={18} strokeWidth={2} />
                    </button>
                )}
                <button
                    className="btn btn-sm d-flex align-items-center justify-content-center border-0 rounded-circle"
                    style={{ width: 32, height: 32, padding: 0, color: page === 1 ? "var(--bs-tertiary-color)" : "var(--bs-secondary-color)", background: "transparent" }}
                    disabled={page === 1}
                    onClick={handlePrev}
                >
                    <ChevronLeft size={18} strokeWidth={2} />
                </button>

                <div className="d-flex align-items-center mx-1 gap-1">
                    {pages.map((pageNumber) => {
                        const isActive = page === pageNumber;
                        return (
                            <button
                                key={pageNumber}
                                className={`btn btn-sm d-flex align-items-center justify-content-center border-0 rounded-circle ${
                                    isActive ? "btn-primary text-white shadow-sm fw-bold" : "text-secondary fw-medium"
                                }`}
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                    background: isActive ? "" : "transparent",
                                    fontSize: "13px"
                                }}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>

                <button
                    className="btn btn-sm d-flex align-items-center justify-content-center border-0 rounded-circle"
                    style={{ width: 32, height: 32, padding: 0, color: page === totalPages ? "var(--bs-tertiary-color)" : "var(--bs-secondary-color)", background: "transparent" }}
                    disabled={page === totalPages}
                    onClick={handleNext}
                >
                    <ChevronRight size={18} strokeWidth={2} />
                </button>
                {showFirstLast && (
                    <button
                        className="btn btn-sm d-flex align-items-center justify-content-center border-0 rounded-circle"
                        style={{ width: 32, height: 32, padding: 0, color: page === totalPages ? "var(--bs-tertiary-color)" : "var(--bs-secondary-color)", background: "transparent" }}
                        disabled={page === totalPages}
                        onClick={() => onPageChange(totalPages)}
                    >
                        <ChevronsRight size={18} strokeWidth={2} />
                    </button>
                )}
            </div>
        </div>
    );
}
