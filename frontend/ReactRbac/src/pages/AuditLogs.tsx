import { useEffect } from 'react';
import Header from "../components/layout/Header";
import { useAuditLogs } from "../hooks/useAuditLogs";

export default function AuditLogs() {
    const { logs, loading, error, meta, page, setPage, fetchLogs } = useAuditLogs();

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return (
        <>
            <Header title="Audit Logs" />
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="card  border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-custom mb-0">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>IP Address</th>
                                    <th>Status</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-muted py-4">No audit logs found</td></tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id}>
                                            <td className="align-middle fw-medium">
                                                <code className="bg-light px-2 py-1 rounded border text-dark">{log.action}</code>
                                            </td>
                                            <td className="align-middle text-muted">
                                                {log.userId ? (
                                                    <div>
                                                        <div className="fw-medium text-dark">{log.userId.name}</div>
                                                        <div className="small">{log.userId.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="fst-italic">System Activity</span>
                                                )}
                                            </td>
                                            <td className="align-middle text-muted font-monospace">
                                                {log.ipAddress || '-'}
                                            </td>
                                            <td className="align-middle">
                                                <span className={`badge ${log.status === 'success' ? 'bg-success' : 'bg-danger'}  ${log.status === 'success' ? 'text-success border-success' : 'text-danger border-danger'} px-3 py-1 rounded-pill shadow-sm border border-opacity-25`}>
                                                    {log.status === 'success' ? 'Success' : 'Failure'}
                                                </span>
                                            </td>
                                            <td className="align-middle text-muted small">
                                                {new Date(log.timestamp).toLocaleString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {meta && meta.totalPages > 1 && (
                        <div className="px-4 py-3 border-top border-light d-flex justify-content-between align-items-center bg-light ">
                            <span className="text-muted small fw-medium">Showing page {meta.currentPage} of {meta.totalPages}</span>
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
        </>
    );
}
