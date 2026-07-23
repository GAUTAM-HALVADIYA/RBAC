import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useRoles } from "../hooks/useRoles";
import Permissions from "./Permissions";
import { DataTable } from "../components/data-table/DataTable";
import { roleColumns, type Role } from "../features/roles/roleColumns";
import type { SortingState } from "../components/data-table/types";
import { useColumnPinning } from "../components/data-table/hooks/useColumnPinning";

export default function Roles() {
    const {
        roles,
        loading,
        error,
        meta,
        page,
        setPage,
        limit,
        setLimit,
        fetchRoles,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
    } = useRoles();

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRole, setEditingRole] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "" });
    const [actionError, setActionError] = useState("");

    const [sorting, setSorting] = useState<SortingState>({ column: null, direction: null });
    const { columnPinning, setColumnPinning } = useColumnPinning();
    const [selectedRows, setSelectedRows] = useState<Role[]>([]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleCreateClick = () => {
        setIsEditing(false);
        setEditingRole(null);
        setFormData({ name: "" });
        setActionError("");
        setShowModal(true);
    };

    const handleEditClick = (role: any) => {
        setIsEditing(true);
        setEditingRole(role);
        setFormData({ name: role.name });
        setActionError("");
        setShowModal(true);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError("");

        let res;
        if (isEditing) {
            res = await handleUpdateRole(editingRole._id, formData);
        } else {
            res = await handleCreateRole(formData);
        }

        if (res.success) {
            setShowModal(false);
        } else {
            setActionError(
                res.error || (isEditing ? "Update failed" : "Creation failed"),
            );
        }
    };

    const onDeleteClick = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this role?"))
            return;
        const res = await handleDeleteRole(id);
        if (!res.success) {
            alert(res.error || "Delete failed");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Header title="Roles Management" />
                <button
                    className="btn btn-primary shadow-sm"
                    onClick={handleCreateClick}
                >
                    + Create Role
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <DataTable
                        tableId="roles-table"
                        data={roles}
                        columns={roleColumns(handleEditClick, onDeleteClick)}
                        isLoading={loading}
                        enableSorting={true}
                        sorting={sorting}
                        onSortingChange={setSorting}
                        enableRowSelection={true}
                        onRowSelectionChange={setSelectedRows}
                        enableColumnPinning={true}
                        columnPinning={columnPinning}
                        onColumnPinningChange={setColumnPinning}
                        enableColumnVisibility={true}
                        enableExport={true}
                        exportFileName="roles"
                        enablePagination={true}
                        page={page}
                        pageSize={limit}
                        showPageSize={true}
                        onPageSizeChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                            fetchRoles(1, newLimit);
                        }}
                        pageSizeOptions={[10, 15, 30]}
                        totalPages={meta?.totalPages || 1}
                        totalRecords={meta?.totalRecords || 0}
                        onPageChange={setPage}
                        showFirstLast={true}
                        showInfo={true}
                    />
                </div>
            </div>

            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-body-tertiary  border-bottom-0 pb-3 pt-4 px-4">
                                <h5 className="modal-title fw-bold text-dark fs-5">
                                    {isEditing ? "Edit Role" : "Create Role"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close shadow-none"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="modal-body px-4">
                                    {actionError && (
                                        <div className="alert alert-danger py-2 small rounded-3">
                                            {actionError}
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">
                                            Role Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg shadow-none fs-6"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            required
                                            placeholder="e.g. Editor"
                                        />
                                    </div>
                                    {isEditing && (
                                        <div className="mt-4 border-top pt-4">
                                            <h6 className="fw-bold text-dark mb-3">
                                                Role Permissions
                                            </h6>
                                            <Permissions
                                                roleId={editingRole?._id}
                                                isEmbedded={true}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer bg-body-tertiary  border-top-0 pt-3 pb-4 px-4">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4 py-2 text-muted fw-medium border shadow-sm"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 fw-medium shadow-sm"
                                    >
                                        {isEditing
                                            ? "Save Changes"
                                            : "Create Role"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
