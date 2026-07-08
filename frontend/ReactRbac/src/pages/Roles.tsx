import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import Table from "../components/common/Table";
import Button from "../components/common/Button";

export default function Roles() {
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <Header title="Roles Management" />
                <Button>+ Create Role</Button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <Table
                    headers={["Role Name", "Description", "Users Count"]}
                    data={[
                        { "role name": "Super Admin", description: "Full system access", "users count": "2" },
                        { "role name": "Manager", description: "Can manage users and content", "users count": "15" },
                    ]}
                />
            </div>
        </Layout>
    );
}
