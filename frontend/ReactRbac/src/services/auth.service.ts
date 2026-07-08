import api from "../api";
import type { RegisterRequest, VerifyOpt } from "../types/auth.types";


export const registerUser = async (data: RegisterRequest) => {

    const response = await api.post("/auth/register", data)
    return response.data;
}
export const verifyOtp = async (data: VerifyOpt) => {

    const response = await api.post("/auth/verify-otp", data)
    return response.data;
}