import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import Table from "../components/common/Table";
import Pagination from "../components/common/Pagination";
import { Card } from 'react-bootstrap';

export default function AuditLogs() {
    const dummyData = [
        { action: "CREATE_USER", user: "admin@example.com", date: "2026-07-07 10:30", ip: "192.168.1.1" },
        { action: "UPDATE_ROLE", user: "admin@example.com", date: "2026-07-07 11:15", ip: "192.168.1.1" },
    ];
    return (
        <Layout>
            <Header title="Audit Logs" />
            <Card className="glass-panel border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table headers={["Action", "User", "Date", "IP"]} data={dummyData} />
                    <div className="px-4">
                        <Pagination />
                    </div>
                </Card.Body>
            </Card>
        </Layout>
    );
}
