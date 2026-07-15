import { useState, createContext, useEffect } from "react";
import type { ReactNode } from "react";

import { getProfile } from "../services/user.service";
import type { AuthContextType } from "../types/auth.types";



export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );
    const [profile, setProfile] = useState<any>(null);

    const fetchProfileData = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await getProfile();
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch user profile in context", err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
        } else {
            setProfile(null);
        }
    }, [isAuthenticated]);

    const login = (token: string, refreshToken?: string) => {
        localStorage.setItem("accessToken", token);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("accessToken"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, profile, login, logout, fetchProfileData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
