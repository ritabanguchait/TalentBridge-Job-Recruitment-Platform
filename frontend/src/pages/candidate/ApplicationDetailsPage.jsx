import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  FileText,
  AlertTriangle
} from 'lucide-react';
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
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner text="Loading application timeline and feedback history..." />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'var(--rose-50)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <AlertCircle size={26} />
          </div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>Application Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Could not find details for this application.'}</p>
          <Link to="/candidate/applications" className="btn btn-primary">
            <ArrowLeft size={15} />
            <span>Back to My Applications</span>
          </Link>
        </div>
      </div>
    );
  }

  const canWithdraw = app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && app.status !== 'SELECTED';

  // Pipeline stages for visual indicator
  const stages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Decision' },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'SHORTLISTED': return 2;
      case 'INTERVIEW':
      case 'INTERVIEW_SCHEDULED': return 3;
      case 'SELECTED':
      case 'REJECTED':
      case 'WITHDRAWN': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(app.status);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '880px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/candidate/applications" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <ArrowLeft size={14} />
          <span>My Applications</span>
        </Link>
      </div>

      {/* Main Dossier Summary Card */}
      <div className="card card-body" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-default)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StatusBadge status={app.status} type="application" />
              {app.jobType && <StatusBadge status={app.jobType} type="jobType" />}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-950)', margin: '0.25rem 0' }}>
              {app.jobTitle}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              <Building2 size={16} />
              <span>{app.companyName}</span>
              <span style={{ color: 'var(--slate-400)' }}>&bull;</span>
              <span style={{ color: 'var(--slate-600)', fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} />
                <span>{app.location || 'Remote'}</span>
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
              Submitted On
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--slate-800)' }}>
              {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </strong>
            {canWithdraw && (
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowWithdrawModal(true)}
                >
                  Withdraw Application
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Background Track Line */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '14px', 
                left: '24px', 
                right: '24px', 
                height: '3px', 
                backgroundColor: 'var(--slate-200)',
                zIndex: 1 
              }} 
            />
            {/* Active Track Line */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '14px', 
                left: '24px', 
                width: `${(currentStageIndex / (stages.length - 1)) * 100}%`, 
                height: '3px', 
                backgroundColor: app.status === 'REJECTED' || app.status === 'WITHDRAWN' ? 'var(--rose-500)' : 'var(--primary-600)',
                zIndex: 2,
                transition: 'width 0.3s ease'
              }} 
            />

            {stages.map((stage, idx) => {
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isTerminalNegative = (app.status === 'REJECTED' || app.status === 'WITHDRAWN') && isCurrent;

              return (
                <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isTerminalNegative
                        ? 'var(--rose-600)'
                        : isPassed
                        ? 'var(--primary-600)'
                        : '#ffffff',
                      border: `2px solid ${isPassed ? (isTerminalNegative ? 'var(--rose-600)' : 'var(--primary-600)') : 'var(--slate-300)'}`,
                      color: isPassed ? '#ffffff' : 'var(--slate-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--slate-900)' : 'var(--slate-500)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isTerminalNegative && idx === stages.length - 1
                      ? app.status === 'REJECTED' ? 'Rejected' : 'Withdrawn'
                      : stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cover Note Section */}
        {app.coverNote && (
          <div style={{ padding: '1.25rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-600)', marginBottom: '0.4rem' }}>
              <FileText size={14} className="text-primary" />
              <span>Your Attached Pitch / Cover Note</span>
            </div>
            <p style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--slate-800)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              {app.coverNote}
            </p>
          </div>
        )}
      </div>

      {/* Status History Timeline */}
      <div className="card card-body" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-950)', marginBottom: '1.75rem' }}>
          Application Progression History
        </h2>

        {app.timeline && app.timeline.length > 0 ? (
          <div style={{ position: 'relative', paddingLeft: '1.75rem', borderLeft: '2px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {app.timeline.map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Timeline Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-2.15rem',
                    top: '0.25rem',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'var(--primary-600)' : 'var(--slate-400)',
                    border: '2.5px solid var(--surface-card)',
                    boxShadow: '0 0 0 2px var(--border-default)',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <StatusBadge status={item.status} type="application" />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} />
                    <span>{new Date(item.changedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>

                {item.remarks ? (
                  <div style={{ marginTop: '0.45rem', fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--surface-subtle)', border: '1px solid var(--border-default)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                      <MessageSquare size={13} className="text-primary" />
                      <span>Note from hiring manager:</span>
                    </div>
                    <div>{item.remarks}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    Status progressed to {item.status?.replace(/_/g, ' ')}
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
        message="Are you sure you want to withdraw this application? This action cannot be reversed and your application will be marked as withdrawn."
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
