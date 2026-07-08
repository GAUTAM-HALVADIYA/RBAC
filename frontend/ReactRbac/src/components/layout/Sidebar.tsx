import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const links = ['Dashboard', 'Users', 'Roles', 'Modules', 'Permissions', 'Audit Logs'];
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Security OS</div>
      <nav className="sidebar-nav">
        {links.map((link) => {
          const path = `/${link.toLowerCase().replace(' ', '-')}`;
          const isActive = location.pathname === path || (path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link 
              key={link} 
              to={path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {link}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}