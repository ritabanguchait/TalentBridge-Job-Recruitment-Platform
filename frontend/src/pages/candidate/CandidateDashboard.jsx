import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CalendarCheck, 
  Award, 
  ArrowRight, 
  User, 
  Search, 
  Building2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, appsData] = await Promise.all([
          applicationService.getCandidateDashboardStats(),
          applicationService.getMyApplications(0, 5),
        ]);
        setStats(statsData);
        setRecentApplications(appsData.content || []);
      } catch (err) {
        console.error('Failed to load candidate dashboard', err);
        setError('Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Engineer';

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Compiling candidate dashboard metrics..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-header-content">
          <span className="badge badge-candidate" style={{ marginBottom: '0.45rem' }}>
            Job Seeker Hub
          </span>
          <h1 className="page-title">
            Welcome back, {displayName}
          </h1>
          <p className="page-subtitle">
            Here is your live application activity, status transitions, and active hiring stages.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/jobs" className="btn btn-primary">
            <Search size={15} />
            <span>Search Jobs</span>
          </Link>
          <Link to="/candidate/profile" className="btn btn-outline">
            <User size={15} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stat Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card stat-primary">
          <div className="stat-content">
            <span className="stat-label">Total Applied</span>
            <div className="stat-val">{stats?.totalApplications || 0}</div>
            <span className="stat-desc">Submitted applications</span>
          </div>
          <div className="stat-icon">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-content">
            <span className="stat-label">Under Review</span>
            <div className="stat-val">{stats?.underReviewCount || 0}</div>
            <span className="stat-desc">Pending initial screening</span>
          </div>
          <div className="stat-icon">
            <Clock size={20} />
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-content">
            <span className="stat-label">Interviews</span>
            <div className="stat-val">{(stats?.shortlistedCount || 0) + (stats?.interviewCount || 0)}</div>
            <span className="stat-desc">{stats?.interviewCount || 0} currently scheduled</span>
          </div>
          <div className="stat-icon">
            <CalendarCheck size={20} />
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-content">
            <span className="stat-label">Selected</span>
            <div className="stat-val">{stats?.selectedCount || 0}</div>
            <span className="stat-desc">Offers / selections</span>
          </div>
          <div className="stat-icon">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', margin: 0 }}>Recent Applications</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Your 5 latest job submissions and their status</p>
          </div>
          <Link to="/candidate/applications" className="btn btn-outline btn-sm">
            <span>View All ({stats?.totalApplications || 0})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--slate-100)', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No applications submitted yet</h3>
            <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem' }}>
              Explore vetted roles from top engineering teams and start submitting your applications.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              <Search size={14} />
              <span>Browse Job Listings</span>
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${app.jobId}`} style={{ color: 'var(--slate-900)' }}>
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={13} className="text-muted" />
                        <span>{app.companyName}</span>
                      </div>
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <StatusBadge status={app.status} type="application" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/candidate/applications/${app.id}`} className="btn btn-outline btn-sm">
                        <span>Timeline</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
