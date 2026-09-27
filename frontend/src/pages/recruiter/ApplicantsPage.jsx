import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Users, 
  Mail, 
  Briefcase, 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  User
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [statusFilter, setStatusFilter] = useState('');
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicants = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (jobId) {
        data = await applicationService.getJobApplications(jobId, statusFilter || undefined, pageNumber, 10);
      } else {
        data = await applicationService.getAllRecruiterApplications(pageNumber, 10);
      }
      setApplications(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load applicants', err);
      setError('Unable to load applicant list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(0);
  }, [jobId, statusFilter]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Recruiter</span>
            <span>&bull;</span>
            <span>Talent Pipeline</span>
          </div>
          <h1 className="page-title">
            {jobId ? `Applicants for Requisition #${jobId}` : 'All Candidate Applications'}
          </h1>
          <p className="page-subtitle">
            {jobId
              ? `Review, filter, and progress candidates who applied for Job #${jobId}.`
              : 'Review candidate profiles and update pipeline progression statuses across all active openings.'}
          </p>
        </div>

        {jobId && (
          <div className="page-actions">
            <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} />
              <span>Back to Job Postings</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      {jobId && (
        <div className="card card-body" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, fontSize: '0.885rem', color: 'var(--slate-800)' }}>
            <Filter size={15} className="text-primary" />
            <span>Filter Pipeline Stage:</span>
          </div>
          <select
            id="statusFilter"
            className="form-select"
            style={{ maxWidth: '240px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Pipeline Stages</option>
            <option value="APPLIED">Applied (Under Review)</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected / Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading && applications.length === 0 ? (
        <div style={{ padding: '3.5rem 1.5rem' }}>
          <LoadingSpinner text="Loading applicant profiles..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No Applicants Found"
          message={
            statusFilter
              ? 'No applicants match the selected pipeline status filter.'
              : 'No candidates have submitted applications for this position yet.'
          }
          actionLabel={jobId ? 'View All Jobs' : undefined}
          onAction={jobId ? () => window.location.href = '/recruiter/jobs' : undefined}
        />
      ) : (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Contact Email</th>
                  <th>Applied Position</th>
                  <th>Submission Date</th>
                  <th>Pipeline Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const candidateInitials = (app.candidateName || 'Candidate')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={app.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div 
                            style={{ 
                              width: 34, 
                              height: 34, 
                              borderRadius: 'var(--radius-full)', 
                              backgroundColor: 'var(--primary-50)', 
                              color: 'var(--primary-700)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 700, 
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}
                          >
                            {candidateInitials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                              {app.candidateName || `Candidate #${app.candidateId}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                          <Mail size={13} className="text-muted" />
                          <span>{app.candidateEmail || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--slate-800)' }}>{app.jobTitle}</span>
                      </td>
                      <td>{new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <StatusBadge status={app.status} type="application" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/recruiter/applications/${app.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <span>Review Dossier</span>
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-default)' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchApplicants(page - 1)}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchApplicants(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
