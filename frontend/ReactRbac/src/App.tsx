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
import Layout from "./components/layout/Layout";

function App() {
    return (
        
            <Routes>
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/modules" element={<Modules />} />
                    <Route path="/permissions" element={<Permissions />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
       
		// <Login/>
    );
}

export default App;
