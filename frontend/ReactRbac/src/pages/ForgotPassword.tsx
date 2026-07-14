import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
    const { handleForgotPassword, loading, error } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg("");
        
        const response = await handleForgotPassword({ email });
        
        if (response?.success) {
            sessionStorage.setItem("resetPasswordEmail", email);
            setSuccessMsg("OTP sent successfully. Redirecting to reset password...");
            setTimeout(() => {
                navigate("/reset-password");
            }, 2000);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container d-flex justify-content-center">
                <div className="card  border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4 fw-bold" style={{ color: "#212529" }}>
                            Forgot Password
                        </h2>
                        <p className="text-center text-muted mb-4">Enter your email to receive an OTP</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted small">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-lg" 
                                    placeholder="user@example.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div className="text-danger mb-3 small text-center">{error}</div>}
                            {successMsg && <div className="text-success mb-3 small text-center">{successMsg}</div>}

                            <button className="btn btn-primary w-100 btn-lg mb-3" type="submit" disabled={loading || !email}>
                                {loading ? "Loading..." : "Send OTP"}
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
