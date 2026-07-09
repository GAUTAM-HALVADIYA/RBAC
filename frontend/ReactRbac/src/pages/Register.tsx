import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Register() {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
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

        const response = await register(formData);

        if (!response) return;
        sessionStorage.setItem("correntVerifyEmail", formData.email);
        navigate("/verify-otp", { replace: true });
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container d-flex justify-content-center">
                <div className="card glass-panel border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4 fw-bold" style={{ color: "var(--text-main)" }}>
                            Create Account
                        </h2>
                        <p className="text-center text-muted mb-4">Register for a new RBAC account</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted small">Name</label>
                                <input className="form-control" name="name" placeholder="Name" onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted small">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted small">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                            </div>

                            {error && <span className="text-danger">{error}</span>}

                            <button className="btn btn-primary w-100 btn-lg" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Register"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
