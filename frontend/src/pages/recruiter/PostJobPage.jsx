import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Code, 
  FileText, 
  Save, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import jobService from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PostJobPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'ENTRY_LEVEL',
    salaryMin: '',
    salaryMax: '',
    skillsRequired: '',
    status: 'OPEN',
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const data = await jobService.getJobById(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            location: data.location || '',
            jobType: data.jobType || 'FULL_TIME',
            experienceLevel: data.experienceLevel || 'ENTRY_LEVEL',
            salaryMin: data.salaryMin !== null && data.salaryMin !== undefined ? data.salaryMin : '',
            salaryMax: data.salaryMax !== null && data.salaryMax !== undefined ? data.salaryMax : '',
            skillsRequired: data.skillsRequired || '',
            status: data.status || 'OPEN',
          });
        } catch (err) {
          console.error('Failed to load job for editing', err);
          setErrorMessage('Unable to load job details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        skillsRequired: formData.skillsRequired.trim(),
        ...(isEditing ? { status: formData.status } : {}),
      };

      if (isEditing) {
        await jobService.updateJob(id, payload);
      } else {
        await jobService.createJob(payload);
      }

      navigate('/recruiter/jobs');
    } catch (err) {
      console.error('Failed to submit job posting', err);
      const msg = err.response?.data?.message || 'Failed to save job posting. Please check all required fields.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Loading position information..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/jobs" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <ArrowLeft size={14} />
          <span>Manage Jobs</span>
        </Link>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Recruiter</span>
            <span>&bull;</span>
            <span>{isEditing ? 'Modify Opening' : 'New Listing'}</span>
          </div>
          <h1 className="page-title">
            {isEditing ? 'Edit Job Posting' : 'Publish New Job Posting'}
          </h1>
          <p className="page-subtitle">
            {isEditing
              ? 'Update the criteria, salary bracket, or status for this position.'
              : 'Publish an open role to attract engineering candidates across our platform.'}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Role Overview */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Role Specifications
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Job Title *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. Senior Java Backend Engineer"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
              />
              <Briefcase size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="jobType">
                Employment Type *
              </label>
              <select
                id="jobType"
                name="jobType"
                className="form-select"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experienceLevel">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className="form-select"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="ENTRY_LEVEL">Entry Level (0-2 years)</option>
                <option value="MID_LEVEL">Mid Level (3-5 years)</option>
                <option value="SENIOR_LEVEL">Senior Level (5+ years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Compensation */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Location & Compensation
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Job Location *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. Bangalore, India (or Remote)"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength={120}
                />
                <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Listing Status *
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="OPEN">Open (Accepting Applicants)</option>
                  <option value="CLOSED">Closed (Archived)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="salaryMin">
                Minimum Annual Salary (INR)
              </label>
              <input
                id="salaryMin"
                name="salaryMin"
                type="number"
                min="0"
                step="50000"
                className="form-input"
                placeholder="e.g. 600000"
                value={formData.salaryMin}
                onChange={handleChange}
              />
              <small className="form-hint">E.g. 6,00,000 PA</small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salaryMax">
                Maximum Annual Salary (INR)
              </label>
              <input
                id="salaryMax"
                name="salaryMax"
                type="number"
                min="0"
                step="50000"
                className="form-input"
                placeholder="e.g. 1200000"
                value={formData.salaryMax}
                onChange={handleChange}
              />
              <small className="form-hint">E.g. 12,00,000 PA</small>
            </div>
          </div>
        </div>

        {/* Section 3: Tech Stack & Description */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Requirements & Description
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="skillsRequired">
              Required Technical Skills (Comma separated)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="skillsRequired"
                name="skillsRequired"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. Java 17, Spring Boot, MySQL, React, RESTful APIs, Docker"
                value={formData.skillsRequired}
                onChange={handleChange}
              />
              <Code size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Role Description & Key Responsibilities *
            </label>
            <textarea
              id="description"
              name="description"
              rows="8"
              className="form-textarea"
              placeholder="Outline the day-to-day responsibilities, technical expectations, team culture, and interview stages..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Link to="/recruiter/jobs" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{ minWidth: '170px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : isEditing ? 'Update Position' : 'Publish Job Opening'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
