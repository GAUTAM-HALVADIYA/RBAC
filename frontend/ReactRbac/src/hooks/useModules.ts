import { useState, useCallback } from 'react';
import { getModules, createModule, updateModule, deleteModule } from '../services/module.service';
import axios from 'axios';

export function useModules() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchModules = useCallback(async (currentPage: number = page, currentLimit: number = limit) => {
        try {
            setLoading(true);
            setError('');
            const res = await getModules({ page: currentPage, limit: currentLimit });
            setModules(res.data);
            if (res.meta) setMeta(res.meta);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch modules');
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleCreateModule = async (data: any) => {
        try {
            await createModule(data);
            await fetchModules(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Creation failed' };
            }
            return { success: false, error: 'Creation failed' };
        }
    };

    const handleUpdateModule = async (id: string, data: any) => {
        try {
            await updateModule(id, data);
            await fetchModules(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'Update failed' };
        }
    };

    const handleDeleteModule = async (id: string) => {
        try {
            await deleteModule(id);
            await fetchModules(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Delete failed' };
            }
            return { success: false, error: 'Delete failed' };
        }
    };

    return {
        modules,
        loading,
        error,
        meta,
        page,
        setPage,
        limit,
        setLimit,
        fetchModules,
        handleCreateModule,
        handleUpdateModule,
        handleDeleteModule
    };
}
