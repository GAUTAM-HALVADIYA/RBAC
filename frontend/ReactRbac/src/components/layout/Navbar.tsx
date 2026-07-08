import React from 'react';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar">
      <h2 className="navbar-title">RBAC Dashboard</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Admin User</span>
        <div style={{ 
          width: '36px', height: '36px', background: 'var(--primary-color)', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          boxShadow: '0 2px 5px rgba(79, 70, 229, 0.3)', cursor: 'pointer'
        }}>
          <User size={18} />
        </div>
      </div>
    </header>
  );
}