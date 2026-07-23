import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useUsers } from "../hooks/useUsers";
import { getRoles } from "../services/role.service";
import { DataTable } from "../components/data-table/DataTable";
import { userColumns, type User } from "../features/users/userColumns";
import type { SortingState } from "../components/data-table/types";
import { useColumnPinning } from "../components/data-table/hooks/useColumnPinning";

export default function Users() {
    const { users, loading, error, meta, page, setPage, limit, setLimit, fetchUsers, handleUpdateUser, handleDeleteUser } = useUsers();
    const [roles, setRoles] = useState<any[]>([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({ name: "", role: "" });
    const [actionError, setActionError] = useState("");

    const [sorting, setSorting] = useState<SortingState>({ column: null, direction: null });
    const { columnPinning, setColumnPinning } = useColumnPinning();
    const [selectedRows, setSelectedRows] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getRoles({ limit: 100 });
                setRoles(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRoles();
    }, []);

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditFormData({ name: user.name, role: user.role?._id || "" });
        setActionError("");
        setShowEditModal(true);
    };

    const onUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError("");
        const res = await handleUpdateUser(editingUser._id, editFormData);
        if (res.success) {
            setShowEditModal(false);
        } else {
            setActionError(res.error || "Update failed");
        }
    };

    const onDeleteClick = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        const res = await handleDeleteUser(id);
        if (!res.success) {
            alert(res.error || "Delete failed");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Header title="Users Management" />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <DataTable
                        tableId="users-table"
                        data={users}
                        columns={userColumns(handleEditClick, onDeleteClick)}
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
                        exportFileName="users"
                        enablePagination={true}
                        page={page}
                        pageSize={limit}
                        showPageSize={true}
                        onPageSizeChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                            fetchUsers(1, newLimit);
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

            {showEditModal && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-body-tertiary  border-bottom-0 pb-3 pt-4 px-4">
                                <h5 className="modal-title fw-bold text-dark fs-5">Edit User</h5>
                                <button
                                    type="button"
                                    className="btn-close shadow-none"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={onUpdateSubmit}>
                                <div className="modal-body px-4">
                                    {actionError && <div className="alert alert-danger py-2 small rounded-3">{actionError}</div>}
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg shadow-none fs-6"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">
                                            Assign Role
                                        </label>
                                        <select
                                            className="form-select form-select-lg shadow-none fs-6"
                                            value={editFormData.role}
                                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Role
                                            </option>
                                            {roles.map((r) => (
                                                <option key={r._id} value={r._id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                        
                                    </div>
                                </div>
                                <div className="modal-footer bg-body-tertiary  border-top-0 pt-3 pb-4 px-4">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4 py-2 text-muted fw-medium border shadow-sm"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4 py-2 fw-medium shadow-sm">
                                        Save Changes
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
