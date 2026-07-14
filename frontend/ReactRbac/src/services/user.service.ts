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

export interface UserProfileResponse {
    success: boolean;
    data: {
        _id: string;
        name: string;
        email: string;
        role: any;
        bio?: string;
        address?: string;
        dob?: string;
        avatar?: string;
    };
}

export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

export const updateProfile = async (data: { name?: string; bio?: string; address?: string; dob?: string }) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/users/profile/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteAvatar = async () => {
    const response = await api.delete("/users/profile/avatar");
    return response.data;
};
