import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';

export default function Modules() {
  return (
    <Layout>
      <Header title="Modules" />
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Module configuration goes here.</p>
      </div>
    </Layout>
  );
}