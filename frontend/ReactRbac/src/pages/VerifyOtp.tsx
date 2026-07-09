import { Form, Button, Card, Container } from 'react-bootstrap';

export default function VerifyOtp() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="glass-panel border-0 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-2 fw-bold" style={{ color: 'var(--text-main)' }}>Verify OTP</h2>
            <p className="text-center text-muted mb-4">Enter the 6-digit code sent to your email.</p>
            <Form>
              <Form.Group className="mb-4">
                <Form.Control 
                  type="text" 
                  placeholder="123456" 
                  size="lg" 
                  className="text-center" 
                  style={{ letterSpacing: '0.5em', fontSize: '1.25rem' }}
                  maxLength={6} 
                />
              </Form.Group>

              <Button variant="primary" className="w-100 btn-primary" size="lg" type="submit">
                Verify Code
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}