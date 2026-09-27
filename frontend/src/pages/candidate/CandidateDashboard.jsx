import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading candidate overview..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Job Seeker Hub</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted">Here is a quick snapshot of your active job applications and hiring progress.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/jobs" className="btn btn-primary">
            Explore Openings &rarr;
          </Link>
          <Link to="/candidate/profile" className="btn btn-outline">
            Update Profile
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card card-body" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Applied</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.25rem' }}>
            {stats?.totalApplications || 0}
          </div>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Under Review</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {stats?.underReviewCount || 0}
          </div>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Shortlisted & Interviews</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.25rem' }}>
            {(stats?.shortlistedCount || 0) + (stats?.interviewCount || 0)}
          </div>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Offers / Selected</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.selectedCount || 0}
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Recent Applications</h2>
          <Link to="/candidate/applications" className="btn btn-outline btn-sm">
            View All ({stats?.totalApplications || 0}) &rarr;
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              You haven't applied for any positions yet.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Discover Jobs Now
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${app.jobId}`} style={{ color: 'inherit' }}>
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td>{app.companyName}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} type="application" />
                    </td>
                    <td>
                      <Link to={`/candidate/applications/${app.id}`} className="btn btn-outline btn-sm">
                        View Details
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
