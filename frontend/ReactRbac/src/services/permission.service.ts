import api from "../api";
import type { PermissionResponse } from "../types/permission.types";

export const getPermissions = async () => {
    const response = await api.get<PermissionResponse>("/permissions");
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