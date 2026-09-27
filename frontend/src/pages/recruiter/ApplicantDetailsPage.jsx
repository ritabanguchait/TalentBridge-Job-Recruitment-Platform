import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ApplicantDetailsPage = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update form state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplicationDetailsForRecruiter(id);
      setApp(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error('Failed to load application details', err);
      setError('Unable to load applicant details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      await applicationService.updateApplicationStatus(id, selectedStatus, remarks.trim());
      setUpdateSuccess(true);
      setRemarks('');
      // Reload updated timeline and status
      const updated = await applicationService.getApplicationDetailsForRecruiter(id);
      setApp(updated);
    } catch (err) {
      console.error('Failed to update status', err);
      const msg = err.response?.data?.message || 'Failed to update candidate status.';
      setUpdateError(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading candidate dossier..." />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Applicant Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Unable to load applicant dossier.'}</p>
          <Link to="/recruiter/applicants" className="btn btn-primary">
            &larr; Back to Applicants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '980px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/applicants" className="btn btn-outline btn-sm">
          &larr; Back to Pipeline Applicants
        </Link>
      </div>

      {updateSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          Applicant status successfully updated to <strong>{app.status?.replace('_', ' ')}</strong>.
        </div>
      )}

      {updateError && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {updateError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Candidate Dossier & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Candidate Profile Card */}
          <div className="card card-body" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0 0 0.25rem 0' }}>
                  {app.candidateName || 'Candidate Profile'}
                </h1>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.05rem' }}>
                  {app.candidateHeadline || 'Job Candidate'}
                </div>
              </div>
              <StatusBadge status={app.status} type="application" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</span>
                <strong>{app.candidateEmail || '—'}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Phone</span>
                <strong>{app.candidatePhone || '—'}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Location</span>
                <strong>{app.location || '—'}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Applied Position</span>
                <strong>{app.jobTitle}</strong>
              </div>
            </div>

            {app.candidateSkills && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Skills Declared
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {app.candidateSkills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--surface-subtle)',
                        border: '1px solid var(--border-color)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links to Resume and Portfolio */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {app.candidateResumeUrl ? (
                <a
                  href={app.candidateResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  View Attached Resume &rarr;
                </a>
              ) : (
                <span className="text-muted" style={{ fontSize: '0.85rem', alignSelf: 'center' }}>No resume URL attached</span>
              )}

              {app.candidatePortfolioUrl && (
                <a
                  href={app.candidatePortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Portfolio / GitHub &rarr;
                </a>
              )}
            </div>

            {/* Candidate Cover Note */}
            {app.coverNote && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Candidate Pitch / Cover Note
                </span>
                <p style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--navy-800)', fontSize: '0.95rem' }}>
                  {app.coverNote}
                </p>
              </div>
            )}
          </div>

          {/* Timeline Card */}
          <div className="card card-body" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Candidate Review Timeline
            </h2>

            {app.timeline && app.timeline.length > 0 ? (
              <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {app.timeline.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
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
                      <div style={{ marginTop: '0.35rem', fontSize: '0.9rem', color: 'var(--navy-800)', background: 'var(--surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <strong>Feedback Note:</strong> {item.remarks}
                      </div>
                    ) : (
                      <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        Transitioned to {item.status?.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No status transitions recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Update Application Status Widget */}
        <div className="card card-body" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Update Status</h3>

          <form onSubmit={handleStatusSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="newStatus">Application Stage</label>
              <select
                id="newStatus"
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="APPLIED">Applied (Under Review)</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="SELECTED">Selected / Offer Extended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="remarks">Feedback / Notes</label>
              <textarea
                id="remarks"
                rows="4"
                className="form-input"
                placeholder="Add interview scheduling details, screening notes, or constructive feedback..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <small className="text-muted">These remarks will appear in the candidate's tracking timeline.</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={updating}
            >
              {updating ? 'Saving Status...' : 'Apply Status Transition'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;
