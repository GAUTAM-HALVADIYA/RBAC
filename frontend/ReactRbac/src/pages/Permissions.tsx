import { useEffect, useState } from "react";

import Header from "../components/layout/Header";

import { usePermissions } from "../hooks/usePermission";
import { useAuth } from "../hooks/useAuth";

import type { Permission } from "../types/permission.types";
import { DataTable } from "../components/data-table/DataTable";
import { permissionColumns } from "../features/permissions/permissionColumns";
import { Pagination } from "../components/data-table/Pagination";
import type { SortingState } from "../components/data-table/types";
import { updateModule } from "../services/module.service";
import { useDebounce } from "../hooks/useDebounce";

export default function Permissions({
    roleId,
    moduleId,
    isEmbedded,
}: {
    roleId?: string;
    moduleId?: string;
    isEmbedded?: boolean;
}) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // const [sortBy, setSortBy] = useState("");
    // const [sortOrder, setSortOrder] = useState("asc");
    const [sorting, setSorting] = useState<SortingState>({
        column: null,
        direction: null,
    });
    const { permissions, loading, error, savePermission, meta } =
        usePermissions(
            page,
            limit,
            debouncedSearch,
            // sortBy,
            // sortOrder,
            sorting.column ?? "",
            sorting.direction ?? "",
            roleId,
            moduleId,
        );

    // Automatically go to the last valid page if the current page exceeds total pages 
    // (e.g. when limit increases or records are deleted)
    useEffect(() => {
        if (meta && meta.totalPages > 0 && page > meta.totalPages) {
            setPage(meta.totalPages);
        }
    }, [meta?.totalPages, page]);

    const { fetchProfileData } = useAuth();
    const [rows, setRows] = useState<Permission[]>([]);

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
    };

    const handleCellEdit = async (rowIndex: number, columnId: string, newValue: string) => {
        if (columnId === "module") {
            const rowToUpdate = rows[rowIndex];
            if (!rowToUpdate) return;
            try {
                // 1. Update in Backend
                await updateModule(rowToUpdate.moduleId._id, { name: newValue });
                
                // 2. Update the local UI state optimistically
                setRows((prevRows) => {
                    const newRows = [...prevRows];
                    newRows[rowIndex] = {
                        ...newRows[rowIndex],
                        moduleId: { ...newRows[rowIndex].moduleId, name: newValue }
                    };
                    return newRows;
                });
            } catch (err) {
                console.error("Failed to update module name:", err);
                alert("Failed to update module name. Please try again.");
            }
        }
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
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {/* <div className="d-flex gap-2">
                                <select className="form-select shadow-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="">Sort By...</option>
                                    <option value="roleId">Role</option>
                                    <option value="moduleId">Module</option>
                                </select>
                                <select
                                    className="form-select shadow-none"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    disabled={!sortBy}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div> */}
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <DataTable
                        tableId="permissions-table"
                        data={rows}
                        columns={permissionColumns(
                            handleReadChange,
                            handleWriteChange,
                            handleSave,
                        )}
                        maxHeight="600px"
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isLoading={loading}
                        onCellEdit={handleCellEdit}
                        enableRowSelection={true}
                        onRowSelectionChange={(selectedRows) => {
                            console.log("Selected rows:", selectedRows);
                        }}
                        enableRowReordering={true}
                        onRowReorder={(newRows) => {
                            setRows(newRows);
                        }}
                        renderExpandedRow={(row) => (
                            <div className="bg-light p-3 border-bottom shadow-sm">
                                <strong>Detailed Info:</strong>
                                <p className="mb-0 text-muted">
                                    Role ID: {row.roleId._id} <br />
                                    Module ID: {row.moduleId._id} <br />
                                    Key: {row.moduleId.key}
                                </p>
                            </div>
                        )}
                    />
                </div>

                <Pagination
                    onPageChange={setPage}
                    page={page}
                    totalPages={meta.totalPages}
                    totalRecords={meta.totalRecords}
                    showFirstLast
                    showInfo
                    pageSize={limit}
                    showPageSize
                    onPageSizeChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                    pageSizeOptions={[10, 15, 30]}
                />
            </div>
        </>
    );
}
