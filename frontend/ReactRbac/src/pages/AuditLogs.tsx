import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import Table from "../components/common/Table";
import Pagination from "../components/common/Pagination";

export default function AuditLogs() {
    const dummyData = [
        { action: "CREATE_USER", user: "admin@example.com", date: "2026-07-07 10:30", ip: "192.168.1.1" },
        { action: "UPDATE_ROLE", user: "admin@example.com", date: "2026-07-07 11:15", ip: "192.168.1.1" },
    ];
    return (
        <Layout>
            <Header title="Audit Logs" />
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <Table headers={["Action", "User", "Date", "IP"]} data={dummyData} />
                <Pagination />
            </div>
        </Layout>
    );
}
