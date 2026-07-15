import { useEffect, useState } from "react";

import Header from "../components/layout/Header";

import { usePermissions } from "../hooks/usePermission";
import { useAuth } from "../hooks/useAuth";

import type { Permission } from "../types/permission.types";
import { DataTable } from "../components/data-table/DataTable";
import { permissionColumns } from "../features/permissions/permissionColumns";

export default function Permissions({
    searchBy,
    isEmbedded,
}: {
    searchBy?: string;
    isEmbedded?: boolean;
}) {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState(searchBy ?? "");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const { permissions, loading, error, savePermission, meta } =
        usePermissions(page, limit, search, sortBy, sortOrder);
    const { fetchProfileData } = useAuth();
    const [rows, setRows] = useState<Permission[]>([]);
    const [numberInc, setNumberInc] = useState(0);
    const nuOfPage = 3;
    const mid: number = Math.floor(nuOfPage / 2);

    useEffect(() => {
        setRows(permissions);
    }, [permissions]);

    const handleReadChange = (id: string, checked: boolean) => {
        setRows((prev) =>
            prev.map((row) =>
                row._id === id
                    ? {
                          ...row,
                          permissions: {
                              ...row.permissions,
                              read: checked,
                          },
                      }
                    : row,
            ),
        );
    };

    const handleWriteChange = (id: string, checked: boolean) => {
        setRows((prev) =>
            prev.map((row) =>
                row._id === id
                    ? {
                          ...row,
                          permissions: {
                              read: checked ? true : row.permissions.read,
                              write: checked,
                          },
                      }
                    : row,
            ),
        );
    };

    const handleSave = async (permission: Permission) => {
        await savePermission(
            permission._id,
            permission.permissions.read,
            permission.permissions.write,
        );
        if (fetchProfileData) {
            await fetchProfileData();
        }
        alert("Permission Updated");
    };

    return (
        <>
            {!isEmbedded && <Header title="Permissions" />}

            <div className={`card border-0 ${isEmbedded ? "" : "shadow-sm"}`}>
                <div className={`card-body ${isEmbedded ? "p-0" : ""}`}>
                    {!isEmbedded && (
                        <div className="d-flex justify-content-between mb-3 gap-3">
                            <input
                                type="text"
                                className="form-control shadow-none"
                                style={{ maxWidth: "300px" }}
                                placeholder="Search role or module..."
                                value={search}
                                disabled={!!searchBy}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select shadow-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="">Sort By...</option>
                                    <option value="roleId">Role</option>
                                    <option value="moduleId">Module</option>
                                </select>
                                <select
                                    className="form-select shadow-none"
                                    value={sortOrder}
                                    onChange={(e) =>
                                        setSortOrder(e.target.value)
                                    }
                                    disabled={!sortBy}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <DataTable
                            data={rows}
                            columns={permissionColumns(
                                handleReadChange,
                                handleWriteChange,
                                handleSave,
                            )}
                        />
                    )}
                </div>
                <div className="d-flex justify-content-between p-3 border-top pagination">
                    <button
                        className="page-item page-link"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    {/* meta.totalPages - page >= indexPages */}
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-end">
                            {/* Previous Button */}
                            <li
                                className={`page-item ${page === 1 ? "disabled" : ""}`}
                            >
                                <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={page === 1 ? -1 : 0}
                                    onClick={() => {
                                        if (
                                            mid <= page &&
                                            page - mid > 1 &&
                                            page <= meta.totalPages - mid
                                        )
                                            setNumberInc((prev) => prev - 1);
                                        setPage(page - 1);
                                    }}
                                >
                                    Previous
                                </a>
                            </li>

                            {/* Page Numbers */}
                            {Array.from({ length: nuOfPage }, (_, index) => {
                                const pageNum = index + 1 + numberInc;
                                return (
                                    <li
                                        className={`page-item ${page === pageNum ? "active" : ""}`}
                                        key={pageNum}
                                    >
                                        <a className="page-link" href="#">
                                            {pageNum}
                                        </a>
                                    </li>
                                );
                            })}

                            {/* Next Button */}
                            <li
                                className={`page-item ${page >= (meta.totalPages || 1) ? "disabled" : ""}`}
                            >
                                <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={
                                        page >= (meta.totalPages || 1) ? -1 : 0
                                    }
                                    onClick={() => {
                                        if (
                                            mid < page &&
                                            page + mid < meta.totalPages
                                        )
                                            setNumberInc((prev) => prev + 1);
                                        setPage(page + 1);
                                    }}
                                >
                                    Next
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <span className="text-muted small fw-medium mt-1">
                        Page {page} of {meta.totalPages || 1}
                    </span>

                    <button
                        className="page-item page-link"
                        disabled={page >= (meta.totalPages || 1)}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
