import { Form, Button, Card, Container } from 'react-bootstrap';

export default function Login() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="glass-panel border-0 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--text-main)' }}>Welcome Back</h2>
            <p className="text-center text-muted mb-4">Please login to your RBAC account</p>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-muted small">Email Address</Form.Label>
                <Form.Control type="email" placeholder="admin@example.com" size="lg" />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-muted small">Password</Form.Label>
                <Form.Control type="password" placeholder="••••••••" size="lg" />
              </Form.Group>

              <Button variant="primary" className="w-100 btn-primary" size="lg" type="submit">
                Sign In
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}