import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Compiling platform-wide telemetry..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.5rem' }}>Platform Administration</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            System Analytics & Governance
          </h1>
          <p className="text-muted">High-level platform activity, account metrics, and ecosystem telemetry.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/admin/jobs" className="btn btn-secondary">
            Moderate Jobs
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card card-body" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Registered Accounts</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.25rem' }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.activeUsers || 0} active &bull; {stats?.inactiveUsers || 0} suspended
          </div>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Job Postings</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.25rem' }}>
            {stats?.totalJobs || 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.activeJobs || 0} currently open & accepting applicants
          </div>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Applications Processed</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.totalApplications || 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across all recruiters & candidate submissions
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="card card-body" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Account Role Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Job Seekers (Candidates)</span>
              <strong>{stats?.totalCandidates || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Employers (Recruiters)</span>
              <strong>{stats?.totalRecruiters || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Platform Administrators</span>
              <strong>
                {(stats?.totalUsers || 0) - ((stats?.totalCandidates || 0) + (stats?.totalRecruiters || 0))}
              </strong>
            </div>
          </div>
        </div>

        <div className="card card-body" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Quick Governance Shortcuts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
              <span>Review User Accounts & Statuses</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/admin/jobs" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
              <span>Moderate & Audit All Job Postings</span>
              <span>&rarr;</span>
            </Link>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ justifyContent: 'space-between' }}
            >
              <span>Explore OpenAPI / Swagger Documentation</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
