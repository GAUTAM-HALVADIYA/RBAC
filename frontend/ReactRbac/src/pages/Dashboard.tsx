import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { getDashboardStats } from "../services/dashboard.service";

export default function Dashboard() {
    const [statsData, setStatsData] = useState({ totalUsers: 0, totalRoles: 0, totalModules: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStatsData(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    const stats = [
        { label: "Total Users", value: statsData.totalUsers },
        { label: "Active Roles", value: statsData.totalRoles },
        { label: "System Modules", value: statsData.totalModules },
    ];

    return (
        <>
            <Header title="Dashboard" subtitle="Overview of your system metrics" />
            <div className="row mb-4">
                {stats.map((stat) => (
                    <div className="col-md-4" key={stat.label}>
                        <div className="card">
                            <div className="card-body">
                                <h5>{stat.label}</h5>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <h3>{stat.value}</h3>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
