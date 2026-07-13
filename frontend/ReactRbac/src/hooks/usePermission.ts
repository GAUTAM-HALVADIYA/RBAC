import { useEffect, useState } from "react";
import axios from "axios";

import { getPermissions, updatePermission } from "../services/permission.service";

import type { PermissionResponse } from "../types/permission.types";

export function usePermissions(page: number, limit: number) {
    const [permissions, setPermissions] = useState<PermissionResponse>({
        data: [],
        meta: { page: 0, limit: 0, totalRecords: 0, totalPages: 0 },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPermissions = async (page: number, limit: number) => {
        try {
            setLoading(true);
            setError("");

            const response = await getPermissions(page, limit);

            setPermissions(response);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const savePermission = async (id: string, read: boolean, write: boolean) => {
        try {
            await updatePermission(id, {
                read,
                write,
            });

            setPermissions((prev) => ({
                ...prev,
                data: prev.data.map((permission) =>
                    permission._id === id ? { ...permission, permissions: { read, write } } : permission,
                ),
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Unable to update permission");
            }

            throw err;
        }
    };

    useEffect(() => {
        fetchPermissions(page, limit);
    }, [page, limit]);

    return {
        permissions: permissions.data,
        meta: permissions.meta,
        loading,
        error,
        savePermission,
        fetchPermissions,
    };
}
