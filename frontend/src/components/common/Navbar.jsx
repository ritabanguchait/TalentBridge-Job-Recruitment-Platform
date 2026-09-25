import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const role = user?.role;

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"></path>
              <path d="M2 19h20"></path>
              <path d="M12 7V3"></path>
              <path d="M8 7V5"></path>
              <path d="M16 7V5"></path>
            </svg>
          </div>
          <span className="brand-name">Talent<span className="brand-accent">Bridge</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Browse Jobs
          </NavLink>

          {/* Role-specific Nav Links */}
          {isAuthenticated && role === 'ROLE_CANDIDATE' && (
            <>
              <NavLink to="/candidate/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/candidate/applications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                My Applications
              </NavLink>
              <NavLink to="/candidate/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          )}

          {isAuthenticated && role === 'ROLE_RECRUITER' && (
            <>
              <NavLink to="/recruiter/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/recruiter/post-job" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Post Job
              </NavLink>
              <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Manage Jobs
              </NavLink>
              <NavLink to="/recruiter/applicants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Applicants
              </NavLink>
            </>
          )}

          {isAuthenticated && role === 'ROLE_ADMIN' && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Users
              </NavLink>
              <NavLink to="/admin/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Job Moderation
              </NavLink>
            </>
          )}

          {/* User Account / Auth Actions */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-profile-menu">
                <div className="user-badge-info">
                  <span className="user-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-role-tag">
                    {role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline btn-sm logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
