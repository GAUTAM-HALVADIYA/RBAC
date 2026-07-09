import { useState } from "react";
import type { LoginRequest, RegisterRequest, VerifyOpt } from "../types/auth.types";
import { registerUser, verifyOtp, loginUser} from "../services/auth.service";
import axios from "axios";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const verifyOTP = async (data: VerifyOpt) => {
        try {
            setLoading(true);
            setError("");

            const res = await verifyOtp(data);
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

    return {
        loading,
        error,
        register,
        verifyOTP,
        login
    };
}
