import api from "../api";

export const getUsers = async (params: any = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
};

export const updateUser = async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
