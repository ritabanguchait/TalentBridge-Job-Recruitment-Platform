import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('ROLE_CANDIDATE');
  const [name, setName] = useState('');
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

    if (role === 'ROLE_RECRUITER' && !companyName.trim()) {
      setErrorMessage('Company Name is required for Recruiter registration.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
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
      const msg = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: '520px' }}>
      <div className="card card-body" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Join TalentBridge
          </h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Choose your account type to get started
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {errorMessage}
          </div>
        )}

        {/* Account Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${role === 'ROLE_CANDIDATE' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setRole('ROLE_CANDIDATE')}
            style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Job Seeker</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.2rem' }}>Looking for roles</div>
          </button>

          <button
            type="button"
            className={`btn ${role === 'ROLE_RECRUITER' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setRole('ROLE_RECRUITER')}
            style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Employer / Recruiter</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.2rem' }}>Hiring developers</div>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder={role === 'ROLE_RECRUITER' ? 'e.g. Sarah Jenkins' : 'e.g. John Doe'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Work / Personal Email</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {role === 'ROLE_RECRUITER' && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-company">Company / Organization Name</label>
              <input
                id="reg-company"
                type="text"
                className="form-input"
                placeholder="e.g. Acme Tech Innovations"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : `Register as ${role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}`}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
