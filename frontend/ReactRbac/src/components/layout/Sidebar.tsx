import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Box, Key, FileText } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Users', icon: <Users size={18} /> },
    { name: 'Roles', icon: <Shield size={18} /> },
    { name: 'Modules', icon: <Box size={18} /> },
    { name: 'Permissions', icon: <Key size={18} /> },
    { name: 'Audit Logs', icon: <FileText size={18} /> }
  ];
  
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield color="white" size={20} />
        </div>
        Security OS
      </div>
      <div className="nav flex-column sidebar-nav gap-2">
        {links.map((link) => {
          const path = `/${link.name.toLowerCase().replace(' ', '-')}`;
          const isActive = location.pathname === path || (path === '/dashboard' && location.pathname === '/');
          
          return (
            <div className="nav-item" key={link.name}>
              <Link 
                to={path} 
                className={`nav-link nav-link-custom ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                {link.name}
              </Link>
            </div>
          );
        })}
      </div>
    </aside>
  );
}