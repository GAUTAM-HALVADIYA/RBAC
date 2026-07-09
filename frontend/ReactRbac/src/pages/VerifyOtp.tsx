import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

export default function VerifyOtp() {
    const { verifyOTP, handleResendOTP, loading, error } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [resendMsg, setResendMsg] = useState("");

    const email = sessionStorage.getItem("correntVerifyEmail");

    useEffect(() => {
        if (!email) {
            navigate("/login", { replace: true });
        }
    }, [email, navigate]);

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

    const handleResend = async () => {
        const email = sessionStorage.getItem("correntVerifyEmail");
        if (!email) return;

        setResendMsg("");
        const res = await handleResendOTP({ email });
        if (res?.success) {
            setResendMsg(res.message || "OTP resent successfully");
        }
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

                            {error && <div className="text-danger mb-3 small text-center">{error}</div>}
                            {resendMsg && <div className="text-success mb-3 small text-center">{resendMsg}</div>}

                            <button className="btn btn-primary w-100 btn-lg mb-3" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Verify Code"}
                            </button>

                            <div className="text-center small mt-3">
                                <span className="text-muted">Didn't receive the code? </span>
                                <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={handleResend} disabled={loading}>Resend OTP</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
