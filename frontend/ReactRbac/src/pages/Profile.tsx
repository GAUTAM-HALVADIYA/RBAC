import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import { Card } from 'react-bootstrap';

export default function Profile() {
  return (
    <Layout>
      <Header title="My Profile" />
      <Card className="glass-panel border-0 shadow-sm" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-4 mb-4">
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}
            >
              A
            </div>
            <div>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Admin User</h2>
              <p className="text-muted mb-0">Super Admin</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}