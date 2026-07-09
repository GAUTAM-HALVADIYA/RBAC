import api from "../api";

export const getRoles = async (params: any = {}) => {
    const response = await api.get("/roles", { params });
    return response.data;
};

export const createRole = async (data: any) => {
    const response = await api.post("/roles", data);
    return response.data;
};

export const updateRole = async (id: string, data: any) => {
    const response = await api.patch(`/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id: string) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
};
