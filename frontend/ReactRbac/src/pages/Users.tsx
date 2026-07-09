import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import { Card } from 'react-bootstrap';

export default function Users() {
  const dummyData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  ];
  
  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Header title="Users Management" />
        <Button>+ Add New User</Button>
      </div>
      <Card className="glass-panel border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table headers={['Name', 'Email', 'Role', 'Status']} data={dummyData} />
          <div className="px-4">
            <Pagination />
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}