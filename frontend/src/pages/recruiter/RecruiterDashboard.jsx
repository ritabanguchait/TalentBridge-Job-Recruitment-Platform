import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  CalendarCheck, 
  Award, 
  PlusCircle, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Edit3, 
  AlertCircle 
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

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

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Recruiter';

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Compiling recruiter pipeline metrics..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-header-content">
          <span className="badge badge-recruiter" style={{ marginBottom: '0.45rem' }}>
            Recruiter Command Center
          </span>
          <h1 className="page-title">
            Welcome, {displayName}
          </h1>
          <p className="page-subtitle">
            Manage your open engineering requisitions, review candidates, and accelerate your hiring pipeline.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/recruiter/jobs/new" className="btn btn-primary">
            <PlusCircle size={15} />
            <span>Post New Opening</span>
          </Link>
          <Link to="/recruiter/applicants" className="btn btn-outline">
            <Users size={15} />
            <span>Review Pipeline</span>
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
            <span className="stat-label">Active Jobs</span>
            <div className="stat-val">{stats?.activeJobsCount || 0}</div>
            <span className="stat-desc">{stats?.totalJobsCount || 0} total listings</span>
          </div>
          <div className="stat-icon">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-content">
            <span className="stat-label">Total Applicants</span>
            <div className="stat-val">{stats?.totalApplicantsCount || 0}</div>
            <span className="stat-desc">{stats?.underReviewCount || 0} pending review</span>
          </div>
          <div className="stat-icon">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-content">
            <span className="stat-label">Interviews</span>
            <div className="stat-val">{(stats?.shortlistedCount || 0) + (stats?.interviewCount || 0)}</div>
            <span className="stat-desc">{stats?.interviewCount || 0} scheduled</span>
          </div>
          <div className="stat-icon">
            <CalendarCheck size={20} />
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-content">
            <span className="stat-label">Selected</span>
            <div className="stat-val">{stats?.selectedCount || 0}</div>
            <span className="stat-desc">{stats?.rejectedCount || 0} rejected</span>
          </div>
          <div className="stat-icon">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Recent Job Postings Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', margin: 0 }}>Recent Job Postings</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Monitor applicant volumes and listing statuses</p>
          </div>
          <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
            <span>Manage All ({stats?.totalJobsCount || 0})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--slate-100)', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Briefcase size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No job postings created yet</h3>
            <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem' }}>
              Publish your first engineering job listing to begin receiving qualified candidates.
            </p>
            <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              <span>Create First Job Opening</span>
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
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--slate-900)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                        <MapPin size={13} className="text-muted" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td>{job.jobType?.replace(/_/g, ' ')}</td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        style={{ fontWeight: 700, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Users size={14} />
                        <span>{job.applicantCount || 0} applicants</span>
                      </Link>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">
                          Applicants
                        </Link>
                        <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-outline btn-sm" title="Edit listing">
                          <Edit3 size={13} />
                          <span>Edit</span>
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
