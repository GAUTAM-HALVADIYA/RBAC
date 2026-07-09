import { useState, useContext } from "react";
import type {
    LoginRequest,
    RegisterRequest,
    VerifyOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendOtpRequest,
} from "../types/auth.types";
import {
    registerUser,
    verifyOtp,
    loginUser,
    forgotPassword,
    resetPassword,
    resendOtp,
} from "../services/auth.service";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const auth = useContext(AuthContext);

    const register = async (data: RegisterRequest) => {
        try {
            setLoading(true);
            setError("");

            const res = await registerUser(data);
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.message ?? "Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (data: VerifyOtpRequest) => {
        try {
            setLoading(true);
            setError("");

            const res = await verifyOtp(data);
            if (res.success && res.data?.accessToken) {
                auth?.login(res.data.accessToken, res.data.refreshToken);
            }
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            } else {
                setError("Something went wrong");
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        try {
            setLoading(true);
            setError("");

            const res = await loginUser(data);
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            } else {
                setError("Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (data: ForgotPasswordRequest) => {
        try {
            setLoading(true);
            setError("");
            const res = await forgotPassword(data);
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            } else {
                setError("Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data: ResetPasswordRequest) => {
        try {
            setLoading(true);
            setError("");
            const res = await resetPassword(data);
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            } else {
                setError("Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async (data: ResendOtpRequest) => {
        try {
            setLoading(true);
            setError("");
            const res = await resendOtp(data);
            return res;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            } else {
                setError("Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        auth?.logout();
    };

    return {
        loading,
        error,
        register,
        verifyOTP,
        login,
        logout,
        handleForgotPassword,
        handleResetPassword,
        handleResendOTP,
        isAuthenticated: auth?.isAuthenticated || false,
    };
}
