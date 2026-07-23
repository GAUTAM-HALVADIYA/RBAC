import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { loading, error, login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await login(formData);

        if (!response) return;
        sessionStorage.setItem("correntVerifyEmail", formData.email);
        navigate("/verify-otp", { replace: true });
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-tertiary">
            <div className="container d-flex justify-content-center">
                <div
                    className="card  border-0 shadow-lg"
                    style={{ width: "100%", maxWidth: "400px" }}
                >
                    <div className="card-body p-5">
                        <h2
                            className="text-center mb-4 fw-bold"
                            style={{ color: "#212529" }}
                        >
                            Welcome Back
                        </h2>
                        <p className="text-center text-muted mb-4">
                            Please login to your RBAC account
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted small">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg"
                                    placeholder="user@example.com"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted small">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                            </div>

                            {error && (
                                <div className="text-danger mb-3 small">
                                    {error}
                                </div>
                            )}

                            <button
                                className="btn btn-primary w-100 btn-lg mb-3"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Sign In"}
                            </button>

                            <div className="text-center d-flex justify-content-between small">
                                <Link
                                    to="/forgot-password"
                                    className="text-decoration-none text-muted"
                                >
                                    Forgot Password?
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-decoration-none text-primary fw-medium"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
