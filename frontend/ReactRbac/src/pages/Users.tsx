import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import { useUsers } from '../hooks/useUsers';
import { getRoles } from '../services/role.service';

export default function Users() {
  const { users, loading, error, meta, page, setPage, fetchUsers, handleUpdateUser, handleDeleteUser } = useUsers();
  const [roles, setRoles] = useState<any[]>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: '' });
  const [actionError, setActionError] = useState('');

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
    setEditFormData({ name: user.name, role: user.role?._id || '' });
    setActionError('');
    setShowEditModal(true);
  };

  const onUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    const res = await handleUpdateUser(editingUser._id, editFormData);
    if (res.success) {
      setShowEditModal(false);
    } else {
      setActionError(res.error || 'Update failed');
    }
  };

  const onDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await handleDeleteUser(id);
    if (!res.success) {
      alert(res.error || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Header title="Users Management" />
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card glass-panel border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-custom mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-muted py-4">No users available</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="align-middle fw-medium">{user.name}</td>
                      <td className="align-middle text-muted">{user.email}</td>
                      <td className="align-middle">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill shadow-sm border border-primary border-opacity-25">
                          {user.role?.name || 'No Role'}
                        </span>
                      </td>
                      <td className="align-middle text-end px-4">
                        <button className="btn btn-sm btn-light text-primary me-2 shadow-sm" onClick={() => handleEditClick(user)}>
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-light text-danger shadow-sm" onClick={() => onDeleteClick(user._id)}>
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
            <div className="px-4 py-3 border-top border-light d-flex justify-content-between align-items-center bg-light bg-opacity-50">
              <span className="text-muted small fw-medium">Showing page {meta.currentPage} of {meta.totalPages}</span>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-white border shadow-sm px-3" 
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-sm btn-white border shadow-sm px-3" 
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light bg-opacity-50 border-bottom-0 pb-3 pt-4 px-4">
                <h5 className="modal-title fw-bold text-dark fs-5">Edit User</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={onUpdateSubmit}>
                <div className="modal-body px-4">
                  {actionError && <div className="alert alert-danger py-2 small rounded-3">{actionError}</div>}
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg shadow-none fs-6" 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label text-muted small fw-medium text-uppercase tracking-wide">Assign Role</label>
                    <select 
                      className="form-select form-select-lg shadow-none fs-6" 
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      {roles.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light bg-opacity-50 border-top-0 pt-3 pb-4 px-4">
                  <button type="button" className="btn btn-light px-4 py-2 text-muted fw-medium border shadow-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-medium shadow-sm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}