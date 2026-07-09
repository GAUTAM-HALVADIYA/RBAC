import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import { Card } from 'react-bootstrap';

export default function Permissions() {
  return (
    <Layout>
      <Header title="Permissions" />
      <Card className="glass-panel border-0 shadow-sm">
        <Card.Body className="p-4">
          <p className="text-muted mb-0">Permission matrix goes here.</p>
        </Card.Body>
      </Card>
    </Layout>
  );
}