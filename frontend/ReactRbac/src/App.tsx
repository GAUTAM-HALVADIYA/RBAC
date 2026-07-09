import "./App.css";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import GuestRoute from "./components/shared/GuestRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Modules from "./pages/Modules";
import Permissions from "./pages/Permissions";
import AuditLogs from "./pages/AuditLogs";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        
            <Routes>
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/roles"
                    element={
                        <ProtectedRoute>
                            <Roles />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/modules"
                    element={
                        <ProtectedRoute>
                            <Modules />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/permissions"
                    element={
                        <ProtectedRoute>
                            <Permissions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/audit-logs"
                    element={
                        <ProtectedRoute>
                            <AuditLogs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
       
		// <Login/>
    );
}

export default App;
