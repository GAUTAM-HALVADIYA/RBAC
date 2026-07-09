import api from "../api";

export interface ProfileResponse {
    success: boolean;
    data: {
        _id: string;
        user: {
            _id: string;
            name: string;
            email: string;
        };
        bio?: string;
        address?: string;
        dob?: string;
        avatar?: string;
    };
}

export const getProfile = async () => {
    const response = await api.get("/profile");
    return response.data;
};

export const updateProfile = async (data: { bio?: string; address?: string; dob?: string }) => {
    const response = await api.patch("/profile", data);
    return response.data;
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/profile/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteAvatar = async () => {
    const response = await api.delete("/profile/avatar");
    return response.data;
};
