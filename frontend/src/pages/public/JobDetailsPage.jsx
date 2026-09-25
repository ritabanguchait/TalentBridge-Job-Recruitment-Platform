import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply modal & submission state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        console.error('Failed to load job', err);
        setError('Job posting not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError(null);
    try {
      await applicationService.applyForJob(id, coverNote);
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      console.error('Application failed', err);
      const msg = err.response?.data?.message || 'Failed to submit application. You may have already applied.';
      setApplyError(msg);
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive / Undisclosed';
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)} PA`;
    return min ? `From ${formatter.format(min)} PA` : `Up to ${formatter.format(max)} PA`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner text="Loading job description and requirements..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Position Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Unable to locate this job.'}</p>
          <Link to="/jobs" className="btn btn-primary">
            &larr; Back to Job Directory
          </Link>
        </div>
      </div>
    );
  }

  const isCandidate = isAuthenticated && user?.role === 'ROLE_CANDIDATE';

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Breadcrumb / Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/jobs" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          &larr; Back to All Openings
        </Link>
      </div>

      {applySuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <strong>Application Submitted!</strong> Your application was received by {job.companyName}. You can track its progress in your <Link to="/candidate/applications" style={{ textDecoration: 'underline', color: 'inherit', fontWeight: 600 }}>Applications Dashboard</Link>.
        </div>
      )}

      {applyError && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {applyError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Main Job Details Content */}
        <div className="card card-body" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <StatusBadge status={job.jobType} type="jobType" />
                <StatusBadge status={job.experienceLevel} type="experience" />
                {job.status === 'CLOSED' && <span className="badge badge-withdrawn">Closed</span>}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 600 }}>
                {job.companyName}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--success)' }}>
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
              <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>About the Role</h3>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: 'var(--navy-800)' }}>
              {job.description}
            </div>
          </section>

          {/* Skills Required */}
          {job.skillsRequired && (
            <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Key Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skillsRequired.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--surface-subtle)',
                      border: '1px solid var(--border-color)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Summary & Action Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card card-body" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Job Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</span>
                <strong>{job.location}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role Type</span>
                <strong>{job.jobType?.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Experience</span>
                <strong>{job.experienceLevel?.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hiring Entity</span>
                <strong>{job.companyName}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              {job.status === 'CLOSED' ? (
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                  Applications Closed
                </button>
              ) : isCandidate ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={() => setShowApplyModal(true)}
                  disabled={applySuccess}
                >
                  {applySuccess ? 'Applied' : 'Apply for this Position'}
                </button>
              ) : !isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={() => navigate('/login', { state: { from: location } })}
                >
                  Log In to Apply
                </button>
              ) : (
                <div style={{ padding: '0.75rem', background: 'var(--surface-subtle)', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Signed in as <strong>{user.role}</strong>. Applications are reserved for Candidate accounts.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Cover Note Modal */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Apply for {job.title}</h3>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your registered candidate profile details (resume, contact, and skills) will automatically be attached to this application.
            </p>

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="coverNote">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  id="coverNote"
                  rows="4"
                  className="form-input"
                  placeholder="Introduce yourself, mention key projects, or explain why you are an ideal fit for this role..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  maxLength={1000}
                />
                <small className="text-muted" style={{ display: 'block', marginTop: '0.35rem' }}>
                  {coverNote.length} / 1000 characters
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting Application...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
