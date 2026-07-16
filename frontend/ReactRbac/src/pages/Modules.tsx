import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useModules } from "../hooks/useModules";
import Permissions from "./Permissions";

export default function Modules() {
    const { modules, loading, error, meta, page, setPage, fetchModules, handleCreateModule, handleUpdateModule, handleDeleteModule } =
        useModules();

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingModule, setEditingModule] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", key: "", isActive: true });
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const handleCreateClick = () => {
        setIsEditing(false);
        setEditingModule(null);
        setFormData({ name: "", key: "", isActive: true });
        setActionError("");
        setShowModal(true);
    };

    const handleEditClick = (mod: any) => {
        setIsEditing(true);
        setEditingModule(mod);
        setFormData({ name: mod.name, key: mod.key, isActive: mod.isActive });
        setActionError("");
        setShowModal(true);
    };

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setActionError("");

        let res;
        if (isEditing) {
            res = await handleUpdateModule(editingModule._id, formData);
        } else {
            res = await handleCreateModule(formData);
        }

        if (res.success) {
            setShowModal(false);
        } else {
            setActionError(res.error || (isEditing ? "Update failed" : "Creation failed"));
        }
    };

    const onDeleteClick = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        const res = await handleDeleteModule(id);
        if (!res.success) {
            alert(res.error || "Delete failed");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Header title="Modules Management" />
                <button className="btn btn-primary shadow-sm" onClick={handleCreateClick}>
                    + Create Module
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card  border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-custom mb-0">
                            <thead>
                                <tr>
                                    <th>Module Name</th>
                                    <th>Key</th>
                                    <th>Status</th>
                                    <th className="text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </td>
                                    </tr>
                                ) : modules.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted py-4">
                                            No modules available
                                        </td>
                                    </tr>
                                ) : (
                                    modules.map((mod) => (
                                        <tr key={mod._id}>
                                            <td className="align-middle fw-medium">{mod.name}</td>
                                            <td className="align-middle text-muted">
                                                <code className="bg-light px-2 py-1 rounded border">{mod.key}</code>
                                            </td>
                                            <td className="align-middle">
                                                <span
                                                    className={`badge ${mod.isActive ? "bg-success-subtle text-success border-success" : "bg-danger-subtle text-danger border-danger"} px-3 py-2 rounded-pill shadow-sm border border-opacity-25`}
                                                >
                                                    {mod.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="align-middle text-end px-4">
                                                <button
                                                    className="btn btn-sm btn-light text-primary me-2 shadow-sm"
                                                    onClick={() => handleEditClick(mod)}
                                                >
                                                    <i className="bi bi-pencil-square"></i> Edit 
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light text-danger shadow-sm"
                                                    onClick={() => onDeleteClick(mod._id)}
                                                >
                                                    <i className="bi bi-trash-fill"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className="px-4 py-3 border-top border-light d-flex justify-content-between align-items-center bg-light ">
                            <span className="text-muted small fw-medium">
                                Showing page {meta.currentPage} of {meta.totalPages}
                            </span>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-white border shadow-sm px-3"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-white border shadow-sm px-3"
                                    disabled={page >= meta.totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-light  border-bottom-0 pb-3 pt-4 px-4">
                                <h5 className="modal-title fw-bold text-dark fs-5">{isEditing ? "Edit Module" : "Create Module"}</h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="modal-body px-4">
                                    {actionError && <div className="alert alert-danger py-2 small rounded-3">{actionError}</div>}
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">
                                            Module Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg shadow-none fs-6"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="e.g. User Management"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">
                                            Key
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg shadow-none fs-6"
                                            value={formData.key}
                                            onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase() })}
                                            required
                                            placeholder="e.g. users"
                                            disabled={isEditing}
                                        />
                                        <div className="form-text small">Used programmatically for authorization. Must be unique.</div>
                                    </div>
                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="isActiveSwitch"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <label className="form-check-label ms-2 text-dark fw-medium" htmlFor="isActiveSwitch">
                                            Active
                                        </label>
                                    </div>
                                    {isEditing && (
                                        <div className="mt-4 border-top pt-4">
                                            <h6 className="fw-bold text-dark mb-3">Module Permissions</h6>
                                            <Permissions moduleId={editingModule?._id} isEmbedded={true} />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="modal-footer bg-light  border-top-0 pt-3 pb-4 px-4">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4 py-2 text-muted fw-medium border shadow-sm"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-4 py-2 fw-medium shadow-sm">
                                        {isEditing ? "Save Changes" : "Create Module"}
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
