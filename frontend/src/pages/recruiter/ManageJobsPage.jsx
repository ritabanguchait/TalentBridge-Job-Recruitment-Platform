import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getMyJobs(pageNumber, 10);
      setJobs(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
      setError('Unable to fetch your job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, []);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await jobService.updateJob(job.id, {
        title: job.title,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        skillsRequired: job.skillsRequired,
        status: nextStatus,
      });
      fetchJobs(page);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to change status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    setDeleting(true);
    try {
      await jobService.deleteJob(deleteJobId);
      setDeleteJobId(null);
      fetchJobs(page);
    } catch (err) {
      console.error('Failed to delete job', err);
      alert(err.response?.data?.message || 'Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading your job postings..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Manage Job Postings
          </h1>
          <p className="text-muted">
            Monitor applicant volumes, edit descriptions, toggle listing availability, or close positions.
          </p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          + Create New Job
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Posted Yet"
          message="You haven't posted any job openings. Create a job listing to start receiving qualified applicants."
          actionLabel="Post a Job"
          onAction={() => window.location.href = '/recruiter/jobs/new'}
        />
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Posted Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
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
                    <td>
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        style={{ fontWeight: 700, color: 'var(--primary)' }}
                      >
                        {job.applicantCount || 0} candidates &rarr;
                      </Link>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleToggleStatus(job)}
                        >
                          {job.status === 'OPEN' ? 'Close' : 'Reopen'}
                        </button>
                        <Link
                          to={`/recruiter/jobs/${job.id}/edit`}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          onClick={() => setDeleteJobId(job.id)}
                        >
                          Delete
                        </button>
                      </div>
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
                onClick={() => fetchJobs(page - 1)}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchJobs(page + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteJobId}
        title="Delete Job Posting?"
        message="Are you sure you want to permanently delete this job posting? All attached application records and history for this job will also be removed."
        confirmText="Confirm Delete"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteJobId(null)}
      />
    </div>
  );
};

export default ManageJobsPage;
