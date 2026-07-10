import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";

import { usePermissions } from "../hooks/usePermission";

export default function Permissions() {
    const { permissions, loading, error, changePermission } = usePermissions();

    return (
        <Layout>
            <Header title="Permissions" />

            <div className="card glass-panel border-0 shadow-sm">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Module</th>
                                    <th>Read</th>
                                    <th>Write</th>
                                </tr>
                            </thead>

                            <tbody>
                                {permissions.map((permission) => (
                                    <tr key={permission._id}>
                                        <td>{permission.roleId.name}</td>

                                        <td>{permission.moduleId.name}</td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={permission.permissions.read}
                                                onChange={(e) =>
                                                    changePermission(permission._id, e.target.checked, permission.permissions.write)
                                                }
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={permission.permissions.write}
                                                onChange={(e) =>
                                                    changePermission(permission._id, permission.permissions.read, e.target.checked)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}
