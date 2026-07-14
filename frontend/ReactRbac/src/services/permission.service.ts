import api from "../api";
import type { PermissionResponse } from "../types/permission.types";

export const getPermissions = async (page: number, limit: number, search?: string, sortBy?: string, sortOrder?: string) => {
    let url = `/permissions?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;
    const response = await api.get<PermissionResponse>(url);
    return response.data;
};

export const updatePermission = async (
    id: string,
    permissions: {
        read: boolean;
        write: boolean;
    }
) => {

    const response = await api.patch(`/permissions/${id}`, {
        permissions,
    });

    return response.data;
};