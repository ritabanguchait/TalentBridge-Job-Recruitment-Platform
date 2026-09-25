import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {jobId ? 'Applicants for Position' : 'All Pipeline Applicants'}
          </h1>
          <p className="text-muted">
            {jobId
              ? `Review, filter, and progress candidates who applied for Job #${jobId}.`
              : 'Review candidate profiles and update pipeline statuses across all active openings.'}
          </p>
        </div>

        {jobId && (
          <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
            &larr; Back to Job Postings
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
      {jobId && (
        <div className="card card-body" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label htmlFor="statusFilter" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            className="form-select"
            style={{ maxWidth: '240px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied (Under Review)</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected / Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading && applications.length === 0 ? (
        <div style={{ padding: '3.5rem 1rem' }}>
          <LoadingSpinner text="Loading applicants..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No Applicants Found"
          message={
            statusFilter
              ? 'No applicants match the selected status filter.'
              : 'No candidates have submitted applications for this position yet.'
          }
          actionLabel={jobId ? 'View All Jobs' : undefined}
          onAction={jobId ? () => window.location.href = '/recruiter/jobs' : undefined}
        />
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Job Title</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                      {app.candidateName || 'Candidate #' + app.candidateId}
                    </td>
                    <td>{app.candidateEmail || '—'}</td>
                    <td>{app.jobTitle}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} type="application" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/recruiter/applications/${app.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        Review Profile &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchApplicants(page - 1)}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchApplicants(page + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
