import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  Globe, 
  ExternalLink, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';
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
      setError('Unable to load applicant dossier.');
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
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Compiling candidate evaluation dossier..." />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'var(--rose-50)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <AlertCircle size={26} />
          </div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>Applicant Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Unable to load applicant dossier.'}</p>
          <Link to="/recruiter/applicants" className="btn btn-primary">
            <ArrowLeft size={15} />
            <span>Back to Pipeline Applicants</span>
          </Link>
        </div>
      </div>
    );
  }

  const candidateInitials = (app.candidateName || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/applicants" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <ArrowLeft size={14} />
          <span>Pipeline Applicants</span>
        </Link>
      </div>

      {updateSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.75rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>
            Candidate status was successfully updated to <strong>{app.status?.replace(/_/g, ' ')}</strong>.
          </span>
        </div>
      )}

      {updateError && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{updateError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Candidate Dossier & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Candidate Profile Card */}
          <div className="card card-body" style={{ padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', borderBottom: '1px solid var(--border-default)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div 
                style={{ 
                  width: 52, 
                  height: 52, 
                  borderRadius: 'var(--radius-full)', 
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.25rem', 
                  fontWeight: 800,
                  flexShrink: 0 
                }}
              >
                {candidateInitials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-950)', margin: 0 }}>
                    {app.candidateName || 'Candidate Profile'}
                  </h1>
                  <StatusBadge status={app.status} type="application" />
                </div>
                <div style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '1rem' }}>
                  {app.candidateHeadline || 'Candidate Profile'}
                </div>
              </div>
            </div>

            {/* Candidate Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Contact Email
                </span>
                <strong style={{ color: 'var(--slate-900)' }}>{app.candidateEmail || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Phone Number
                </span>
                <strong style={{ color: 'var(--slate-900)' }}>{app.candidatePhone || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Location
                </span>
                <strong style={{ color: 'var(--slate-900)' }}>{app.location || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Applied Role
                </span>
                <strong style={{ color: 'var(--slate-900)' }}>{app.jobTitle}</strong>
              </div>
            </div>

            {/* Declared Skills Tags */}
            {app.candidateSkills && (
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Declared Technical Skills
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {app.candidateSkills.split(',').map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem' }}>
              {app.candidateResumeUrl ? (
                <a
                  href={app.candidateResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <FileText size={15} />
                  <span>Inspect Attached Resume</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="text-muted" style={{ fontSize: '0.85rem', alignSelf: 'center' }}>No resume URL provided</span>
              )}

              {app.candidatePortfolioUrl && (
                <a
                  href={app.candidatePortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Globe size={15} />
                  <span>Portfolio / GitHub</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* Candidate Cover Pitch Note */}
            {app.coverNote && (
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-600)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <FileText size={14} className="text-primary" />
                  <span>Candidate Pitch Note</span>
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--slate-800)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                  {app.coverNote}
                </p>
              </div>
            )}
          </div>

          {/* Timeline History Card */}
          <div className="card card-body" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-950)', marginBottom: '1.5rem' }}>
              Review & Progression History
            </h2>

            {app.timeline && app.timeline.length > 0 ? (
              <div style={{ position: 'relative', paddingLeft: '1.75rem', borderLeft: '2px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {app.timeline.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <StatusBadge status={item.status} type="application" />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        <span>{new Date(item.changedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    {item.remarks ? (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--surface-subtle)', border: '1px solid var(--border-default)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          <MessageSquare size={13} className="text-primary" />
                          <span>Evaluation feedback note:</span>
                        </div>
                        <div>{item.remarks}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        Candidate transitioned to {item.status?.replace(/_/g, ' ')}
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

        {/* Right Column: Update Status Widget */}
        <aside className="card card-body" style={{ padding: '1.75rem', position: 'sticky', top: '88px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Pipeline Transition
          </h3>

          <form onSubmit={handleStatusSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="newStatus">
                Application Stage *
              </label>
              <select
                id="newStatus"
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="APPLIED">Applied (Under Review)</option>
                <option value="SHORTLISTED">Shortlisted for Review</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="SELECTED">Selected / Offer Extended</option>
                <option value="REJECTED">Candidate Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="remarks">
                Evaluation Notes / Meeting Instructions
              </label>
              <textarea
                id="remarks"
                rows="5"
                className="form-textarea"
                placeholder="Include interview meeting links, screening observations, or constructive feedback for the candidate..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <small className="form-hint">These remarks appear directly in the candidate's tracking timeline.</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={updating}
            >
              <Save size={16} />
              <span>{updating ? 'Saving Stage...' : 'Apply Status Transition'}</span>
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;
