import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';

export default function Profile() {
  return (
    <Layout>
      <Header title="My Profile" />
      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">A</div>
          <div>
            <h2 className="text-2xl font-bold">Admin User</h2>
            <p className="text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}