import { useState, useCallback } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../services/role.service';
import axios from 'axios';

export function useRoles() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);

    const fetchRoles = useCallback(async (currentPage: number = page, limit: number = 10) => {
        try {
            setLoading(true);
            setError('');
            const res = await getRoles({ page: currentPage, limit });
            setRoles(res.data);
            if (res.meta) setMeta(res.meta);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleCreateRole = async (data: any) => {
        try {
            await createRole(data);
            await fetchRoles(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Creation failed' };
            }
            return { success: false, error: 'Creation failed' };
        }
    };

    const handleUpdateRole = async (id: string, data: any) => {
        try {
            await updateRole(id, data);
            await fetchRoles(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'Update failed' };
        }
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await deleteRole(id);
            await fetchRoles(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Delete failed' };
            }
            return { success: false, error: 'Delete failed' };
        }
    };

    return {
        roles,
        loading,
        error,
        meta,
        page,
        setPage,
        fetchRoles,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole
    };
}
