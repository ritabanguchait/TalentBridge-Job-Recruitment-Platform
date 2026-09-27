import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      // Refresh list
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
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading submitted applications..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            My Applications
          </h1>
          <p className="text-muted">
            Track real-time candidate progression and recruiter status updates.
          </p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          Browse More Jobs
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Submitted"
          message="You haven't submitted any job applications yet. Discover matching tech roles and submit your application."
          actionLabel="Search Open Positions"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Submitted Date</th>
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
                        <Link to={`/jobs/${app.jobId}`} style={{ color: 'var(--navy-900)' }}>
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td>{app.companyName}</td>
                      <td>{app.location}</td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={app.status} type="application" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link
                            to={`/candidate/applications/${app.id}`}
                            className="btn btn-outline btn-sm"
                          >
                            Timeline
                          </Link>
                          {canWithdraw && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchApplications(page - 1)}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchApplications(page + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Withdrawal */}
      <ConfirmationModal
        isOpen={!!withdrawAppId}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw this application? The hiring team will be notified, and you will not be able to reactivate this specific submission."
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
