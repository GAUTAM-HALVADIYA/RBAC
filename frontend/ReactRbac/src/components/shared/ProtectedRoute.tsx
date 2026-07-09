import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

	const token = localStorage.getItem("accessToken")
	let isAuthenticated = true;
	if(!token)
		isAuthenticated = false
    // Add authentication logic here
    return isAuthenticated ? <>{children}</> : <Navigate to={"/login"} replace />;
}
