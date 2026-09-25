import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Moderation delete modal
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNumber,
        size: 10,
      };
      if (statusFilter) params.status = statusFilter;

      const data = await adminService.getJobs(params);
      setJobs(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load jobs for admin moderation', err);
      setError('Unable to load job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, [statusFilter]);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await adminService.updateJobStatus(job.id, nextStatus);
      fetchJobs(page);
    } catch (err) {
      console.error('Failed to update job status', err);
      alert('Failed to update job status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    setDeleting(true);
    try {
      await adminService.deleteJob(deleteJobId);
      setDeleteJobId(null);
      fetchJobs(page);
    } catch (err) {
      console.error('Failed to moderate job', err);
      alert(err.response?.data?.message || 'Failed to remove job posting.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Job Moderation & Oversight
          </h1>
          <p className="text-muted">
            Audit public listings across all employers, modify availability, or remove non-compliant postings.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card card-body" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label htmlFor="jobStatusFilter" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
          Filter by Status:
        </label>
        <select
          id="jobStatusFilter"
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open Only</option>
          <option value="CLOSED">Closed Only</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div style={{ padding: '3.5rem 1rem' }}>
          <LoadingSpinner text="Fetching job postings..." />
        </div>
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Showing {jobs.length} of {totalElements} listings
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>#{job.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--navy-900)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td>{job.companyName}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className={`badge ${job.status === 'OPEN' ? 'badge-primary' : 'badge-withdrawn'}`}>
                        {job.status}
                      </span>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteJobId}
        title="Permanently Remove Job?"
        message="As platform administrator, are you sure you want to remove this job posting? This action is permanent and will cascade-delete all candidate applications."
        confirmText="Yes, Remove Job"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteJobId(null)}
      />
    </div>
  );
};

export default JobManagementPage;
