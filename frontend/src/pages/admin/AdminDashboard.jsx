import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  UserCheck, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
        setError('Unable to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Compiling platform-wide telemetry & analytics..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <span className="badge badge-admin" style={{ marginBottom: '0.45rem' }}>
            Platform Administration
          </span>
          <h1 className="page-title">
            System Analytics & Governance
          </h1>
          <p className="page-subtitle">
            High-level platform activity, account ecosystem telemetry, and compliance controls.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/admin/users" className="btn btn-primary">
            <Users size={15} />
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/jobs" className="btn btn-outline">
            <Briefcase size={15} />
            <span>Moderate Jobs</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card stat-primary">
          <div className="stat-content">
            <span className="stat-label">Registered Accounts</span>
            <div className="stat-val">{stats?.totalUsers || 0}</div>
            <span className="stat-desc">{stats?.activeUsers || 0} active &bull; {stats?.inactiveUsers || 0} suspended</span>
          </div>
          <div className="stat-icon">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-content">
            <span className="stat-label">Total Job Postings</span>
            <div className="stat-val">{stats?.totalJobs || 0}</div>
            <span className="stat-desc">{stats?.activeJobs || 0} currently open & accepting applicants</span>
          </div>
          <div className="stat-icon">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-content">
            <span className="stat-label">Applications Processed</span>
            <div className="stat-val">{stats?.totalApplications || 0}</div>
            <span className="stat-desc">Across all recruiters and candidates</span>
          </div>
          <div className="stat-icon">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Operations */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="card card-body" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Account Role Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} className="text-success" />
                <span style={{ fontWeight: 500, color: 'var(--slate-700)' }}>Job Seekers (Candidates)</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>{stats?.totalCandidates || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={16} className="text-primary" />
                <span style={{ fontWeight: 500, color: 'var(--slate-700)' }}>Hiring Employers (Recruiters)</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>{stats?.totalRecruiters || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} className="text-danger" />
                <span style={{ fontWeight: 500, color: 'var(--slate-700)' }}>Platform Administrators</span>
              </div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                {Math.max(0, (stats?.totalUsers || 0) - ((stats?.totalCandidates || 0) + (stats?.totalRecruiters || 0)))}
              </strong>
            </div>
          </div>
        </div>

        <div className="card card-body" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Administrative Governance
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} className="text-primary" />
                <span>Review User Accounts & Suspension Controls</span>
              </span>
              <ArrowRight size={15} />
            </Link>

            <Link to="/admin/jobs" className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={16} className="text-primary" />
                <span>Audit & Moderate Job Postings</span>
              </span>
              <ArrowRight size={15} />
            </Link>

            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} className="text-primary" />
                <span>Interactive Swagger UI Documentation</span>
              </span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
