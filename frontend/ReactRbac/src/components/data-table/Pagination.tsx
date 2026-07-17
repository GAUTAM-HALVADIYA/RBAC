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

            <nav>
                <ul className="pagination mb-0">
                    {showFirstLast && (
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" disabled={page === 1} onClick={() => onPageChange(1)}>
                                First
                            </button>
                        </li>
                    )}
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" disabled={page === 1} onClick={handlePrev}>
                            Previous
                        </button>
                    </li>

                    {pages.map((pageNumber) => (
                        <li key={pageNumber} className={`page-item ${page === pageNumber ? "active" : ""}`}>
                            <button className="page-link" onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" disabled={page === totalPages} onClick={handleNext}>
                            Next
                        </button>
                    </li>
                    {showFirstLast && (
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>
                                Last
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}
