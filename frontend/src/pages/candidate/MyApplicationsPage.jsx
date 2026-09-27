import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Withdraw modal state
  const [withdrawAppId, setWithdrawAppId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchApplications = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getMyApplications(pageNumber, 10);
      setApplications(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load applications', err);
      setError('Unable to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(0);
  }, []);

  const handleWithdrawConfirm = async () => {
    if (!withdrawAppId) return;
    setWithdrawing(true);
    try {
      await applicationService.withdrawApplication(withdrawAppId);
      setWithdrawAppId(null);
      fetchApplications(page);
    } catch (err) {
      console.error('Failed to withdraw application', err);
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Loading submitted applications..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Submissions</span>
            <span>&bull;</span>
            <span>Live Progression</span>
          </div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">
            Track real-time hiring stage transitions and reviewer notes across your active submissions.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/jobs" className="btn btn-primary">
            <Search size={15} />
            <span>Browse More Jobs</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Submitted"
          message="You haven't submitted any job applications yet. Discover engineering opportunities and apply with your candidate profile."
          actionLabel="Search Open Positions"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Showing <strong>{applications.length}</strong> of <strong>{totalElements}</strong> submissions
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Applied Date</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const canWithdraw = app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && app.status !== 'SELECTED';

                  return (
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
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                          <MapPin size={13} className="text-muted" />
                          <span>{app.location || 'Remote'}</span>
                        </div>
                      </td>
                      <td>{new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <StatusBadge status={app.status} type="application" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link
                            to={`/candidate/applications/${app.id}`}
                            className="btn btn-outline btn-sm"
                          >
                            <span>Timeline</span>
                            <ArrowRight size={13} />
                          </Link>
                          {canWithdraw && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setWithdrawAppId(app.id)}
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
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
                onClick={() => fetchApplications(page - 1)}
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
                onClick={() => fetchApplications(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Withdrawal */}
      <ConfirmationModal
        isOpen={!!withdrawAppId}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw this application? The hiring manager will be notified and your submission will be archived."
        confirmText="Yes, Withdraw"
        confirmVariant="danger"
        isLoading={withdrawing}
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setWithdrawAppId(null)}
      />
    </div>
  );
};

export default MyApplicationsPage;
