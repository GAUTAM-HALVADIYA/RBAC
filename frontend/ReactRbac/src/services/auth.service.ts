import api from "../api";
import type {LoginRequest, RegisterRequest, VerifyOpt } from "../types/auth.types";


export const registerUser = async (data: RegisterRequest) => {

    const response = await api.post("/auth/register", data)
    return response.data;
}
export const verifyOtp = async (data: VerifyOpt) => {

    const response = await api.post("/auth/verify-otp", data)
    return response.data;
}
export const loginUser = async (data: LoginRequest) => {

    const response = await api.post("/auth/login", data)
    return response.data;
}
