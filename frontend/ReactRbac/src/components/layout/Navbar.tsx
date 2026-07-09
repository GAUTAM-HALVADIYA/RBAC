import React, { useState, useEffect } from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../services/profile.service';
import type { ProfileResponse } from '../../services/profile.service';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse['data'] | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile in navbar", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container-fluid px-4">
        <a href="#" className="navbar-brand fw-bold fs-4 d-none d-lg-block" style={{ color: 'var(--text-main)' }}>
          RBAC Dashboard
        </a>
        <div className="d-flex align-items-center ms-auto gap-3">
          <div className="position-relative text-muted" style={{ cursor: 'pointer' }}>
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </div>
          
          <div className="dropdown">
            <a 
              href="#" 
              className="d-flex align-items-center gap-2 text-decoration-none shadow-none text-muted"
              onClick={(e) => {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <span className="d-none d-md-block fs-6 fw-medium text-dark">{profile?.user?.name || "Loading..."}</span>
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="rounded-circle object-fit-cover shadow-sm" 
                  style={{ width: '40px', height: '40px' }} 
                />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                     style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)' }}>
                  {profile?.user?.name ? profile.user.name.charAt(0).toUpperCase() : <User size={20} />}
                </div>
              )}
            </a>

            <ul className={`dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 ${dropdownOpen ? 'show' : ''}`} style={{ position: 'absolute' }}>
              <li>
                <Link to="/profile" className="dropdown-item py-2 px-3 d-flex align-items-center gap-2">
                  <User size={16} /> Profile
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item py-2 px-3 text-danger d-flex align-items-center gap-2"
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}