import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  UserCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    role: 'ROLE_CANDIDATE',
    label: 'Candidate',
    email: 'candidate@talentbridge.com',
    password: 'Candidate@123',
    icon: UserCheck,
    colorClass: 'text-success',
    redirectPath: '/candidate/dashboard',
  },
  {
    role: 'ROLE_RECRUITER',
    label: 'Recruiter',
    email: 'recruiter@talentbridge.com',
    password: 'Recruiter@123',
    icon: Building2,
    colorClass: 'text-primary',
    redirectPath: '/recruiter/dashboard',
  },
  {
    role: 'ROLE_ADMIN',
    label: 'Admin',
    email: 'admin@talentbridge.com',
    password: 'Admin@123',
    icon: ShieldCheck,
    colorClass: 'text-danger',
    redirectPath: '/admin/dashboard',
  },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingDemoRole, setLoadingDemoRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const performLogin = async (targetEmail, targetPassword, fallbackPath) => {
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const user = await login(targetEmail, targetPassword);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (fallbackPath) {
        navigate(fallbackPath, { replace: true });
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Authentication failed', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
      setLoadingDemoRole(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await performLogin(email.trim(), password);
  };

  const handleDemoAccountClick = async (demo) => {
    // 1. Automatically populate credentials
    setEmail(demo.email);
    setPassword(demo.password);
    setLoadingDemoRole(demo.role);

    // 2. Submit login request & authenticate
    await performLogin(demo.email, demo.password, demo.redirectPath);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Briefcase size={22} strokeWidth={2.4} />
          </div>
          <h1 className="auth-title">
            Welcome Back
          </h1>
          <p className="auth-subtitle">
            Sign in to manage your applications and candidate pipelines
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting && !loadingDemoRole ? (
              <>
                <Loader2 size={16} className="spinner" style={{ border: 'none', animation: 'spin 0.7s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Interview Demo Accounts */}
        <div className="demo-accounts-section">
          <div className="demo-accounts-label">
            <Sparkles size={13} className="text-primary" />
            <span>Interview Demo Accounts</span>
          </div>

          <div className="demo-accounts-grid">
            {DEMO_ACCOUNTS.map((demo) => {
              const IconComponent = demo.icon;
              const isCurrentlyLoading = loadingDemoRole === demo.role;

              return (
                <button
                  key={demo.role}
                  type="button"
                  className="demo-account-btn"
                  onClick={() => handleDemoAccountClick(demo)}
                  disabled={submitting}
                  title={`Sign in instantly as ${demo.label} (${demo.email})`}
                >
                  {isCurrentlyLoading ? (
                    <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />
                  ) : (
                    <IconComponent size={14} className={demo.colorClass} />
                  )}
                  <span>{isCurrentlyLoading ? 'Logging in...' : demo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Link */}
        <div className="auth-footer">
          <span>Don't have an account yet?</span>
          <Link to="/register" className="auth-footer-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
