import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  X,
  Share2,
  Bookmark
} from 'lucide-react';
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
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner text="Loading role details and requirements..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card card-body" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-full)', background: 'var(--rose-50)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>Position Not Found</h2>
          <p className="text-muted" style={{ marginBottom: '1.75rem', fontSize: '0.925rem' }}>{error || 'Unable to locate this job posting.'}</p>
          <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Job Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCandidate = isAuthenticated && user?.role === 'ROLE_CANDIDATE';
  const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Breadcrumb Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/jobs" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <ArrowLeft size={14} />
          <span>All Openings</span>
        </Link>
      </div>

      {applySuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.75rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Application Successfully Submitted!</strong> Your candidate dossier has been forwarded to <strong>{job.companyName}</strong>. You can follow live status changes in your{' '}
            <Link to="/candidate/applications" style={{ textDecoration: 'underline', color: 'inherit', fontWeight: 700 }}>
              Applications Dashboard
            </Link>.
          </div>
        </div>
      )}

      {applyError && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{applyError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Job Description & Specifications */}
        <article className="card card-body" style={{ padding: '2.25rem' }}>
          {/* Header Block */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', borderBottom: '1px solid var(--border-default)', paddingBottom: '1.75rem', marginBottom: '1.75rem' }}>
            <div 
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 'var(--radius-lg)', 
                background: 'linear-gradient(135deg, var(--slate-100) 0%, var(--slate-200) 100%)', 
                border: '1px solid var(--border-default)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: 'var(--slate-800)',
                flexShrink: 0 
              }}
            >
              {companyInitial}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <StatusBadge status={job.jobType} type="jobType" />
                <StatusBadge status={job.experienceLevel} type="experience" />
                <StatusBadge status={job.status} />
              </div>

              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--slate-950)', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: '0.35rem' }}>
                {job.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.05rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                <Building2 size={16} />
                <span>{job.companyName || 'Confidential Employer'}</span>
              </div>
            </div>
          </div>

          {/* Quick Highlight Strip */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1rem', 
              padding: '1.25rem', 
              backgroundColor: 'var(--surface-subtle)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-default)',
              marginBottom: '2rem' 
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-500)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                Offered Compensation
              </span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--emerald-600)' }}>
                {formatSalary(job.salaryMin, job.salaryMax)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-500)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                Location
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>
                {job.location}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-500)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                Experience
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>
                {job.experienceLevel?.replace(/_/g, ' ')}
              </strong>
            </div>
          </div>

          {/* Description Body */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '1rem' }}>
              About the Role
            </h3>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: 'var(--slate-700)', fontSize: '0.95rem' }}>
              {job.description}
            </div>
          </section>

          {/* Key Required Skills */}
          {job.skillsRequired && (
            <section style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '1rem' }}>
                Required Technical Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skillsRequired.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    className="skill-tag"
                    style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Right Column: Sticky Action Box */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '88px' }}>
          <div className="card card-body" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--slate-900)' }}>
              Overview & Application
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={16} className="text-muted" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Location</span>
                  <strong>{job.location}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Briefcase size={16} className="text-muted" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Role Type</span>
                  <strong>{job.jobType?.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={16} className="text-muted" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Experience</span>
                  <strong>{job.experienceLevel?.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Calendar size={16} className="text-muted" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Published On</span>
                  <strong>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                </div>
              </div>
            </div>

            {/* Application Action Button */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-default)' }}>
              {job.status === 'CLOSED' ? (
                <button className="btn btn-outline" style={{ width: '100%' }} disabled>
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
                  <Send size={16} />
                  <span>{applySuccess ? 'Application Received' : 'Apply for this Position'}</span>
                </button>
              ) : !isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={() => navigate('/login', { state: { from: location } })}
                >
                  Sign In to Apply
                </button>
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Logged in with <strong>{user?.role?.replace('ROLE_', '')}</strong> account. Applications require a Candidate profile.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Modern Application Cover Note Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Apply for {job.title}</h3>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{job.companyName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--primary-600)' }}>
                  <FileText size={18} className="text-primary" style={{ flexShrink: 0 }} />
                  <span>Your registered resume, contact details, and tech skills will be automatically transmitted.</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coverNote">
                    Candidate Pitch / Note (Optional)
                  </label>
                  <textarea
                    id="coverNote"
                    rows="5"
                    className="form-textarea"
                    placeholder="Briefly introduce your qualifications, key projects, or why you are a strong match for this engineering team..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    maxLength={1000}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <small className="form-hint">Tip: Highlight relevant stack achievements</small>
                    <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{coverNote.length} / 1000</small>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Confirm & Submit Application'}
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
