import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function VerifyOtp() {
    const { verifyOTP, loading, error } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const email = sessionStorage.getItem("correntVerifyEmail");

        if (!email) {
            return;
        }

        const response = await verifyOTP({
            email,
            otp,
        });

        if (!response) return;

        sessionStorage.removeItem("correntVerifyEmail");

		if(response.data.accessToken){
			localStorage.setItem("accessToken", response.data.accessToken)
			navigate("/dashboard")
			return;
		}

        navigate("/login", { replace: true });
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container d-flex justify-content-center">
                <div className="card glass-panel border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                    <div className="card-body p-5">
                        <h2 className="text-center mb-2 fw-bold" style={{ color: "var(--text-main)" }}>
                            Verify OTP
                        </h2>
                        <p className="text-center text-muted mb-4">Enter the 6-digit code sent to your email.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="123456"
                                    className="form-control form-control-lg text-center"
                                    style={{ letterSpacing: "0.5em", fontSize: "1.25rem" }}
                                    maxLength={6}
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            {error && <span className="text-danger">{error}</span>}

                            <button className="btn btn-primary w-100 btn-lg" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Verify Code"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
