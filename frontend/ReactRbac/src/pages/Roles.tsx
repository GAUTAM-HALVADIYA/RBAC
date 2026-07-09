import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import { Card } from 'react-bootstrap';

export default function Roles() {
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Header title="Roles Management" />
                <Button>+ Create Role</Button>
            </div>
            <Card className="glass-panel border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table
                        headers={["Role Name", "Description", "Users Count"]}
                        data={[
                            { "role name": "Super Admin", description: "Full system access", "users count": "2" },
                            { "role name": "Manager", description: "Can manage users and content", "users count": "15" },
                        ]}
                    />
                </Card.Body>
            </Card>
        </Layout>
    );
}
