import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";

export default function Dashboard() {
    const stats = [
        { label: "Total Users", value: "1,245", icon: "" },
        { label: "Active Roles", value: "12", icon: "" },
        { label: "System Modules", value: "8", icon: "" },
    ];

    return (
        <Layout>
            <Header title="Dashboard" subtitle="Overview of your system metrics" />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "24px",
                    marginBottom: "24px",
                }}
            >
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ fontSize: "32px", padding: "16px", background: "#eef2ff", borderRadius: "12px" }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                                {stat.label}
                            </h3>
                            <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
