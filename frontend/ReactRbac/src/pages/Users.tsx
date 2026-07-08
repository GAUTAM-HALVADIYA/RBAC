import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';

export default function Users() {
  const dummyData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  ];
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <Header title="Users Management" />
        <Button>+ Add New User</Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <Table headers={['Name', 'Email', 'Role', 'Status']} data={dummyData} />
        <Pagination />
      </div>
    </Layout>
  );
}