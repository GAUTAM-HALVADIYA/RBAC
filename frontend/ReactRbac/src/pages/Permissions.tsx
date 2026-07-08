import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';

export default function Permissions() {
  return (
    <Layout>
      <Header title="Permissions" />
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Permission matrix goes here.</p>
      </div>
    </Layout>
  );
}