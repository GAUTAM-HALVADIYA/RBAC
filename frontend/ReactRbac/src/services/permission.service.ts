import api from "../api";
import type { PermissionResponse } from "../types/permission.types";

export const getPermissions = async (page: number, limit: number) => {
    const response = await api.get<PermissionResponse>(`/permissions?page=${page}&limit=${limit}`);
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