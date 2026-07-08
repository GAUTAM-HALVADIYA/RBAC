import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
// import { Navigate } from "react-router-dom";

function Register() {
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await register(formData);

            console.log(response);

            // later
            // Navigate("/verify-otp")
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} />

            <input name="email" placeholder="Email" onChange={handleChange} />

            <input type="password" name="password" placeholder="Password" onChange={handleChange} />

            <input name="role" placeholder="Role Id" onChange={handleChange} />

            <button disabled={loading}>{loading ? "Loading..." : "Register"}</button>
        </form>
    );
}

export default Register;
