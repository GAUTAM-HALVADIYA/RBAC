import React from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import { Navbar as BootstrapNavbar, Container, Nav, Dropdown } from 'react-bootstrap';

export default function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="navbar-custom sticky-top">
      <Container fluid className="px-4">
        <BootstrapNavbar.Brand href="#" className="fw-bold fs-4 d-none d-lg-block" style={{ color: 'var(--text-main)' }}>
          RBAC Dashboard
        </BootstrapNavbar.Brand>
        <div className="d-flex align-items-center ms-auto gap-3">
          <div className="position-relative text-muted" style={{ cursor: 'pointer' }}>
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </div>
          
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="dropdown-user" className="d-flex align-items-center gap-2 text-decoration-none shadow-none text-muted">
              <span className="d-none d-md-block fs-6 fw-medium text-dark">Admin User</span>
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                   style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)' }}>
                <User size={20} />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-lg border-0 rounded-3 mt-2">
              <Dropdown.Item href="/profile" className="py-2 px-3 d-flex align-items-center gap-2">
                <User size={16} /> Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="/login" className="py-2 px-3 text-danger d-flex align-items-center gap-2">
                <LogOut size={16} /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}