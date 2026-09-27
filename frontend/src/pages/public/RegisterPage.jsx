import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('ROLE_CANDIDATE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Both First Name and Last Name are required.');
      return;
    }

    if (role === 'ROLE_RECRUITER' && !companyName.trim()) {
      setErrorMessage('Company Name is required for Recruiter registration.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role,
        ...(role === 'ROLE_RECRUITER' ? { companyName: companyName.trim() } : {}),
      };

      const user = await register(payload);
      if (user.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Registration failed', err);
      const msg = err.response?.data?.message || 'Registration failed. The email address may already be in use.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
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
            Create Your Account
          </h1>
          <p className="auth-subtitle">
            Join TalentBridge to apply or recruit top engineering talent
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="auth-role-selector">
          <button
            type="button"
            className={`auth-role-btn ${role === 'ROLE_CANDIDATE' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_CANDIDATE')}
          >
            <User size={18} />
            <div className="auth-role-btn-title">Job Seeker</div>
            <div className="auth-role-btn-sub">Seeking roles</div>
          </button>

          <button
            type="button"
            className={`auth-role-btn ${role === 'ROLE_RECRUITER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_RECRUITER')}
          >
            <Building2 size={18} />
            <div className="auth-role-btn-title">Employer</div>
            <div className="auth-role-btn-sub">Hiring talent</div>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-first-name">
                First Name *
              </label>
              <input
                id="reg-first-name"
                type="text"
                className="form-input"
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-last-name">
                Last Name *
              </label>
              <input
                id="reg-last-name"
                type="text"
                className="form-input"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Work / Personal Email *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={submitting}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          {role === 'ROLE_RECRUITER' && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-company">
                Company / Organization *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-company"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. Acme Tech Innovations"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={submitting}
                />
                <Building2 size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register as {role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-footer-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
