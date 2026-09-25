import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Withdraw state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplicationDetailsForCandidate(id);
      setApp(data);
    } catch (err) {
      console.error('Failed to load application details', err);
      setError('Unable to load application details or timeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      await applicationService.withdrawApplication(id);
      setShowWithdrawModal(false);
      fetchDetails();
    } catch (err) {
      console.error('Failed to withdraw', err);
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading application timeline..." />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Application Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Could not find details for this application.'}</p>
          <Link to="/candidate/applications" className="btn btn-primary">
            &larr; Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  const canWithdraw = app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && app.status !== 'SELECTED';

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/candidate/applications" className="btn btn-outline btn-sm">
          &larr; Back to My Applications
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="card card-body" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StatusBadge status={app.status} type="application" />
              <StatusBadge status={app.jobType} type="jobType" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
              {app.jobTitle}
            </h1>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 600 }}>
              {app.companyName} &bull; <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{app.location}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Submitted On</div>
            <div style={{ fontWeight: 600 }}>{new Date(app.appliedAt).toLocaleString()}</div>
            {canWithdraw && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => setShowWithdrawModal(true)}
              >
                Withdraw Application
              </button>
            )}
          </div>
        </div>

        {/* Cover Note Section */}
        {app.coverNote && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'var(--surface-subtle)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Your Attached Pitch / Cover Note
            </div>
            <p style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--navy-800)', fontSize: '0.95rem' }}>
              {app.coverNote}
            </p>
          </div>
        )}
      </div>

      {/* Status History Timeline */}
      <div className="card card-body" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Application Progression History
        </h2>

        {app.timeline && app.timeline.length > 0 ? (
          <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {app.timeline.map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.85rem',
                    top: '0.2rem',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'var(--primary)' : '#94a3b8',
                    border: '2px solid white',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <StatusBadge status={item.status} type="application" />
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {new Date(item.changedAt).toLocaleString()}
                  </span>
                </div>

                {item.remarks ? (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.95rem', color: 'var(--navy-800)', background: 'var(--surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <strong>Note from recruiter:</strong> {item.remarks}
                  </div>
                ) : (
                  <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    Status updated to {item.status?.replace('_', ' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No status transitions recorded yet.</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={showWithdrawModal}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be reversed."
        confirmText="Confirm Withdrawal"
        confirmVariant="danger"
        isLoading={withdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => setShowWithdrawModal(false)}
      />
    </div>
  );
};

export default ApplicationDetailsPage;
