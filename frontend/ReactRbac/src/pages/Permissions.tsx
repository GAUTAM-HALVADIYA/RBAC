import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';

export default function Permissions() {
  return (
    <Layout>
      <Header title="Permissions" />
      <div className="card glass-panel border-0 shadow-sm">
        <div className="card-body p-4">
          <p className="text-muted mb-0">Permission matrix goes here.</p>
        </div>
      </div>
    </Layout>
  );
}