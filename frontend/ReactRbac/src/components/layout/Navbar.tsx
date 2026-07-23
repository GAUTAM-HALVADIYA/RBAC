import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar-custom">
      <div>
        <strong>RBAC Admin</strong>
      </div>
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-outline-secondary border-0" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="dropdown" style={{ display: 'inline-block' }}>
          <button 
            className="btn btn-outline-secondary dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {profile?.name || "User"}
          </button>

          <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} style={{ position: 'absolute', right: 0 }}>
            <li>
              <Link to="/profile" className="dropdown-item">Profile</Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button onClick={handleLogout} className="dropdown-item text-danger">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
