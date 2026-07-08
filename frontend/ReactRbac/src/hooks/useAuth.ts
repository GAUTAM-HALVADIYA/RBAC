import { useState } from "react";
import type { RegisterRequest } from "../types/auth.types";
import { registerUser } from "../services/auth.service";


export function useAuth() {
    const [loading, setLoading] = useState(false);

    const register = async (data: RegisterRequest) => {
        try {
            setLoading(true)
            const response = await registerUser(data);
            return response;
        } finally{
            setLoading(false)
        }

    };
    return {
        loading, register
    }
}
