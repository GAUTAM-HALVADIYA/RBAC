import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import { Row, Col, Card } from "react-bootstrap";
import { Users, Shield, Box } from "lucide-react";

export default function Dashboard() {
    const stats = [
        { label: "Total Users", value: "1,245", icon: <Users size={28} color="var(--primary-color)" /> },
        { label: "Active Roles", value: "12", icon: <Shield size={28} color="var(--primary-color)" /> },
        { label: "System Modules", value: "8", icon: <Box size={28} color="var(--primary-color)" /> },
    ];

    return (
        <Layout>
            <Header title="Dashboard" subtitle="Overview of your system metrics" />
            <Row className="g-4 mb-4">
                {stats.map((stat) => (
                    <Col xs={12} md={4} key={stat.label}>
                        <Card className="glass-panel h-100 border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center gap-4 p-4">
                                <div 
                                    className="rounded-4 d-flex align-items-center justify-content-center" 
                                    style={{ width: '64px', height: '64px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <h3 className="text-muted fw-medium mb-1" style={{ fontSize: "15px" }}>
                                        {stat.label}
                                    </h3>
                                    <p className="fw-bold mb-0 text-dark" style={{ fontSize: "32px", letterSpacing: '-0.5px' }}>
                                        {stat.value}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Layout>
    );
}
