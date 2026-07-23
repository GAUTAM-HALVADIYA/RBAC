import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
    const { handleResetPassword, loading, error } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [successMsg, setSuccessMsg] = useState("");
    const [localError, setLocalError] = useState("");

    const email = sessionStorage.getItem("resetPasswordEmail");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg("");
        setLocalError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        if (!email) return;

        const response = await handleResetPassword({
            email,
            otp: formData.otp,
            newPassword: formData.newPassword
        });
        
        if (response?.success) {
            setSuccessMsg("Password reset successfully! Redirecting to login...");
            sessionStorage.removeItem("resetPasswordEmail");
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-tertiary">
            <div className="container d-flex justify-content-center">
                <div className="card  border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4 fw-bold" style={{ color: "#212529" }}>
                            Reset Password
                        </h2>
                        <p className="text-center text-muted mb-4">Enter your OTP and new password</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted small">6-Digit OTP</label>
                                <input 
                                    type="text" 
                                    name="otp"
                                    className="form-control form-control-lg text-center" 
                                    style={{ letterSpacing: "0.25em" }}
                                    placeholder="123456" 
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted small">New Password</label>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    className="form-control form-control-lg" 
                                    placeholder="••••••••" 
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted small">Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    className="form-control form-control-lg" 
                                    placeholder="••••••••" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {(error || localError) && <div className="text-danger mb-3 small text-center">{localError || error}</div>}
                            {successMsg && <div className="text-success mb-3 small text-center">{successMsg}</div>}

                            <button className="btn btn-primary w-100 btn-lg mb-3" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Reset Password"}
                            </button>

                            <div className="text-center small">
                                <Link to="/login" className="text-decoration-none text-muted">Back to login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
