import api from "../api";

import type {
    RegisterRequest,
    RegisterResponse,
    VerifyOtpRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendOtpRequest,
    AuthResponse,
    MeResponse,
} from "../types/auth.types";

export const registerUser = async (data: RegisterRequest) => {
    const response = await api.post<RegisterResponse>("/auth/register", data);

    return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest) => {
    const response = await api.post("/auth/verify-otp", data);

    return response.data;
};

export const loginUser = async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", data);

    return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
    const response = await api.post("/auth/forgot-password", data);

    return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
    const response = await api.post("/auth/reset-password", data);

    return response.data;
};

export const resendOtp = async (data: ResendOtpRequest) => {
    const response = await api.post("/auth/resend-otp", data);

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get<MeResponse>("/profile/detailed");

    return response.data;
};

export const logout = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};

export const refreshToken = async () => {
    const response = await api.post<AuthResponse>("/auth/refresh-token");

    return response.data;
};
