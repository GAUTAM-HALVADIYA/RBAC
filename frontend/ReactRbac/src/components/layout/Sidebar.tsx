import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
    const { profile } = useAuth();
    const permissions = profile?.permissions;

    const links = [
        { name: "Dashboard", key: "dashboard", path: "/" },
        { name: "Users", key: "users", path: "/users" },
        { name: "Roles", key: "roles", path: "/roles" },
        { name: "Modules", key: "modules", path: "/modules" },
        { name: "Permissions", key: "permissions", path: "/permissions" },
        { name: "Audit Logs", key: "audit-logs", path: "/audit-logs" },
    ];

    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">RBAC System</div>
            <div className="sidebar-nav">
                {links
                    .filter((link) => {
                        if (link.name === "Dashboard") return true;
                        if (!permissions) return false;

                        const perm = permissions.find((p: any) => p.moduleId?.key === link.key);
                        return perm?.moduleId?.isActive === true && perm?.permissions?.read === true;
                    })
                    .map((link) => {
                        const isActive = location.pathname === link.path || (link.path === "/" && location.pathname === "/dashboard");

                        return (
                            <div className="nav-item" key={link.name}>
                                <Link
                                    to={link.path === "/" ? "/dashboard" : link.path}
                                    className={`nav-link-custom ${isActive ? "active" : ""}`}
                                >
                                    {link.name}
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </aside>
    );
}
