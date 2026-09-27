import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Building2, 
  MapPin, 
  Calendar, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Briefcase 
} from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';

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
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Admin</span>
            <span>&bull;</span>
            <span>Content Moderation</span>
          </div>
          <h1 className="page-title">Job Moderation & Compliance</h1>
          <p className="page-subtitle">
            Inspect public job postings across all registered companies, modify status, or delete non-compliant listings.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card card-body" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, fontSize: '0.885rem', color: 'var(--slate-800)' }}>
          <Filter size={15} className="text-primary" />
          <span>Filter by Status:</span>
        </div>
        <select
          id="jobStatusFilter"
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open (Accepting Applicants)</option>
          <option value="CLOSED">Closed (Archived)</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div style={{ padding: '3.5rem 1.5rem' }}>
          <LoadingSpinner text="Fetching job postings for audit..." />
        </div>
      ) : (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Showing <strong>{jobs.length}</strong> of <strong>{totalElements}</strong> job listings
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
                  <th>Listing Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ color: 'var(--slate-500)', fontSize: '0.8rem' }}>#{job.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--slate-900)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={13} className="text-muted" />
                        <span>{job.companyName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                        <MapPin size={13} className="text-muted" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleToggleStatus(job)}
                        >
                          {job.status === 'OPEN' ? 'Close' : 'Reopen'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteJobId(job.id)}
                          title="Remove posting"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-default)' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchJobs(page - 1)}
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
                onClick={() => fetchJobs(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteJobId}
        title="Permanently Remove Job?"
        message="As platform administrator, are you sure you want to delete this job listing? This action cannot be reversed and all applicant submissions associated with this position will be purged."
        confirmText="Confirm Permanent Deletion"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteJobId(null)}
      />
    </div>
  );
};

export default JobManagementPage;
