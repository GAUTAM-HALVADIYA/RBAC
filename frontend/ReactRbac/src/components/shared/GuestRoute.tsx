import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
    const auth = useContext(AuthContext);

    if (!auth) {
        return null;
    }

    return !auth.isAuthenticated ? <>{children}</> : <Navigate to={"/dashboard"} replace />;
}
