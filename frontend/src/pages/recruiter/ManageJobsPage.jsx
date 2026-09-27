import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Users, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import jobService from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';

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
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Loading your job postings..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Recruiter Hub</span>
            <span>&bull;</span>
            <span>Listings Management</span>
          </div>
          <h1 className="page-title">Manage Job Postings</h1>
          <p className="page-subtitle">
            Monitor applicant volumes, edit job requirements, toggle listing availability, or close positions.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/recruiter/jobs/new" className="btn btn-primary">
            <PlusCircle size={15} />
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
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
        <div className="card" style={{ padding: '1.75rem' }}>
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
                        <span>{job.applicantCount || 0} candidates</span>
                      </Link>
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
                        <Link
                          to={`/recruiter/jobs/${job.id}/edit`}
                          className="btn btn-outline btn-sm"
                          title="Edit job"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteJobId(job.id)}
                          title="Delete job"
                        >
                          <Trash2 size={13} />
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteJobId}
        title="Delete Job Posting?"
        message="Are you sure you want to permanently delete this job posting? All candidate applications and review history associated with this role will also be removed."
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
