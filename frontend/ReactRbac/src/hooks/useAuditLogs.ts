import { useState, useCallback, useEffect } from "react";
import { getAuditLogs } from "../services/audit-log.service";

export function useAuditLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
    });

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getAuditLogs({
                page,
                limit: 10,
            });

            setLogs(res.data);
            setMeta(res.meta);
        } catch {
            setError("Failed to fetch audit logs");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        loading,
        error,
        meta,
        page,
        setPage,
        fetchLogs,
    };
}
