import { useState, useCallback } from 'react';
import { getAuditLogs } from '../services/audit-log.service';

export function useAuditLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);

    const fetchLogs = useCallback(async (currentPage: number = page, limit: number = 10) => {
        try {
            setLoading(true);
            setError('');
            const res = await getAuditLogs({ page: currentPage, limit });
            setLogs(res.data);
            if (res.meta) setMeta(res.meta);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch audit logs');
        } finally {
            setLoading(false);
        }
    }, [page]);

    return {
        logs,
        loading,
        error,
        meta,
        page,
        setPage,
        fetchLogs
    };
}
