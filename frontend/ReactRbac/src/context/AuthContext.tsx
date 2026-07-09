import { useState, createContext, useEffect } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string, refreshToken?: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );

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
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;