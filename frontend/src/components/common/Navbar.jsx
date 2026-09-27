import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  LayoutDashboard, 
  FileText, 
  User, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Search
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
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
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || user?.email || 'User';

  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : displayName.substring(0, 2).toUpperCase();

  const getRoleBadge = (r) => {
    if (r === 'ROLE_ADMIN') return { label: 'Admin', color: 'badge-admin' };
    if (r === 'ROLE_RECRUITER') return { label: 'Recruiter', color: 'badge-recruiter' };
    return { label: 'Candidate', color: 'badge-candidate' };
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo-icon">
            <Briefcase size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            Talent<span className="brand-accent">Bridge</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-items-group">
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              <Search size={16} />
              <span>Browse Jobs</span>
            </NavLink>

            {/* Role-specific Nav Links */}
            {isAuthenticated && role === 'ROLE_CANDIDATE' && (
              <>
                <NavLink to="/candidate/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/candidate/applications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <FileText size={16} />
                  <span>My Applications</span>
                </NavLink>
                <NavLink to="/candidate/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <User size={16} />
                  <span>Profile</span>
                </NavLink>
              </>
            )}

            {isAuthenticated && role === 'ROLE_RECRUITER' && (
              <>
                <NavLink to="/recruiter/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/recruiter/post-job" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <PlusCircle size={16} />
                  <span>Post Job</span>
                </NavLink>
                <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <Briefcase size={16} />
                  <span>Manage Jobs</span>
                </NavLink>
                <NavLink to="/recruiter/applicants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <Users size={16} />
                  <span>Applicants</span>
                </NavLink>
              </>
            )}

            {isAuthenticated && role === 'ROLE_ADMIN' && (
              <>
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <Users size={16} />
                  <span>Users</span>
                </NavLink>
                <NavLink to="/admin/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                  <ShieldCheck size={16} />
                  <span>Job Moderation</span>
                </NavLink>
              </>
            )}
          </div>

          {/* User Account / Auth Actions */}
          <div className="navbar-auth">
            <ThemeToggle id="theme-toggle-desktop" className="desktop-theme-toggle" />
            {isAuthenticated ? (
              <div className="user-profile-menu">
                <div className="user-avatar" title={displayName}>
                  {userInitials}
                </div>
                <div className="user-badge-info">
                  <span className="user-name">{displayName}</span>
                  <span className={`user-role-badge badge ${getRoleBadge(role).color}`}>
                    {getRoleBadge(role).label}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline btn-sm logout-btn"
                  title="Sign out of account"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Header Actions (Theme Toggle + Hamburger) */}
        <div className="navbar-mobile-actions">
          <ThemeToggle id="theme-toggle-mobile" className="mobile-theme-toggle" />
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
