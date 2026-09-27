import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, jobsData] = await Promise.all([
          applicationService.getRecruiterDashboardStats(),
          jobService.getMyJobs(0, 5),
        ]);
        setStats(statsData);
        setRecentJobs(jobsData.content || []);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
        setError('Unable to load recruiter statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading recruiter command center..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-recruiter" style={{ marginBottom: '0.5rem' }}>Recruiter Command Center</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Welcome, {user?.name}!
          </h1>
          <p className="text-muted">Manage your job openings, track candidate applicants, and oversee your recruitment pipeline.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recruiter/jobs/new" className="btn btn-primary">
            + Post New Opening
          </Link>
          <Link to="/recruiter/applicants" className="btn btn-secondary">
            Review Applicants
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
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Jobs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.25rem' }}>
            {stats?.activeJobsCount || 0}
          </div>
          <small className="text-muted">{stats?.totalJobsCount || 0} total postings</small>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Applicants</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.25rem' }}>
            {stats?.totalApplicantsCount || 0}
          </div>
          <small className="text-muted">{stats?.underReviewCount || 0} pending review</small>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Shortlisted & Interviewing</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.25rem' }}>
            {(stats?.shortlistedCount || 0) + (stats?.interviewCount || 0)}
          </div>
          <small className="text-muted">{stats?.interviewCount || 0} interviews scheduled</small>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hired / Selected</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.selectedCount || 0}
          </div>
          <small className="text-muted">{stats?.rejectedCount || 0} rejected</small>
        </div>
      </div>

      {/* Recent Job Postings Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Recent Job Postings</h2>
          <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
            Manage All Jobs ({stats?.totalJobsCount || 0}) &rarr;
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              You have not posted any job listings yet.
            </p>
            <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
              Create Your First Job Posting
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--navy-900)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td>{job.location}</td>
                    <td>{job.jobType?.replace('_', ' ')}</td>
                    <td>
                      <span className={`badge ${job.status === 'OPEN' ? 'badge-primary' : 'badge-withdrawn'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{job.applicantCount || 0}</td>
                    <td>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">
                          Applicants
                        </Link>
                        <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-outline btn-sm">
                          Edit
                        </Link>
                      </div>
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

export default RecruiterDashboard;
