import { useState, useCallback } from "react";
import { getUsers, updateUser, deleteUser, createUser } from "../services/user.service";
import axios from "axios";

export function useUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchUsers = useCallback(
        async (currentPage: number = page, currentLimit: number = limit) => {
            try {
                setLoading(true);
                setError("");
                const res = await getUsers({ page: currentPage, limit: currentLimit });
                setUsers(res.data);
                setMeta(res.meta);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        },
        [page],
    );

    const handleUpdateUser = async (id: string, data: any) => {
        try {
            await updateUser(id, data);
            await fetchUsers(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || "Update failed" };
            }
            return { success: false, error: "Update failed" };
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser(id);
            await fetchUsers(page);
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || "Delete failed" };
            }
            return { success: false, error: "Delete failed" };
        }
    };

    const handleCreateUser = async (data: any) => {
        try {
            await createUser(data);

            await fetchUsers(page);

            return {
                success: true,
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return {
                    success: false,
                    error: err.response?.data?.message ?? "Create failed",
                };
            }

            return {
                success: false,
                error: "Create failed",
            };
        }
    };

    return {
        users,
        loading,
        error,
        meta,
        page,
        setPage,
        limit,
        setLimit,
        fetchUsers,
        handleUpdateUser,
        handleDeleteUser,
        handleCreateUser
    };
}
