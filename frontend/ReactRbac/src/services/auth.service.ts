import api from "../api";
import type { LoginRequest, RegisterRequest, VerifyOtpRequest, ForgotPasswordRequest, ResetPasswordRequest, ResendOtpRequest } from "../types/auth.types";


export const registerUser = async (data: RegisterRequest) => {

    const response = await api.post("/auth/register", data)
    return response.data;
}
export const verifyOtp = async (data: VerifyOtpRequest) => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
};

export const loginUser = async (data: LoginRequest) => {
    const response = await api.post("/auth/login", data);
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
