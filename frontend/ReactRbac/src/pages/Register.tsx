import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Form, Button, Card, Container } from 'react-bootstrap';
// import { Navigate } from "react-router-dom";

function Register() {
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e: React.ChangeEvent<any>) => {
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
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Container className="d-flex justify-content-center">
                <Card className="glass-panel border-0 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
                    <Card.Body className="p-5">
                        <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--text-main)' }}>Create Account</h2>
                        <p className="text-center text-muted mb-4">Register for a new RBAC account</p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium text-muted small">Name</Form.Label>
                                <Form.Control name="name" placeholder="Name" onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium text-muted small">Email Address</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Email" onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-medium text-muted small">Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-medium text-muted small">Role ID</Form.Label>
                                <Form.Control name="role" placeholder="Role Id" onChange={handleChange} />
                            </Form.Group>

                            <Button variant="primary" className="w-100 btn-primary" size="lg" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Register"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Register;
