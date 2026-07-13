import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";

import { usePermissions } from "../hooks/usePermission";

import type { Permission } from "../types/permission.types";
import { DataTable } from "../components/data-table/DataTable";
import { permissionColumns } from "../features/permissions/permissionColumns";

export default function Permissions() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const { permissions, loading, error, savePermission, meta } = usePermissions(page, limit);
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
        await savePermission(permission._id, permission.permissions.read, permission.permissions.write);

        alert("Permission Updated");
    };

    return (
        <Layout>
            <Header title="Permissions" />

            <div className="card glass-panel border-0 shadow-sm">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <DataTable data={rows} columns={permissionColumns(handleReadChange, handleWriteChange, handleSave)} />
                    )}
                </div>
                <div className="d-flex justify-content-between">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>

                    <span>
                        {page} / {meta.totalPages}
                    </span>

                    <button disabled={page === meta.totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}
