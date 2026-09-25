import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading position information..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
          &larr; Back to Job Management
        </Link>
      </div>

      <div className="card card-body" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h1>
          <p className="text-muted">
            {isEditing
              ? 'Update the criteria, salary range, or status for this position.'
              : 'Publish an open role to attract candidates across our platform.'}
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Junior Java Full-Stack Developer"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="jobType">Employment Type *</label>
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
              <label className="form-label" htmlFor="experienceLevel">Experience Level *</label>
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

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="location">Job Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Bangalore / Remote"
                value={formData.location}
                onChange={handleChange}
                required
                maxLength={120}
              />
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="form-label" htmlFor="status">Listing Status *</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="OPEN">Open (Accepting Applications)</option>
                  <option value="CLOSED">Closed (Archived)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="salaryMin">Minimum Salary (INR / Annum)</label>
              <input
                id="salaryMin"
                name="salaryMin"
                type="number"
                min="0"
                step="50000"
                className="form-input"
                placeholder="e.g. 500000"
                value={formData.salaryMin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salaryMax">Maximum Salary (INR / Annum)</label>
              <input
                id="salaryMax"
                name="salaryMax"
                type="number"
                min="0"
                step="50000"
                className="form-input"
                placeholder="e.g. 800000"
                value={formData.salaryMax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skillsRequired">Required Skills (Comma separated)</label>
            <input
              id="skillsRequired"
              name="skillsRequired"
              type="text"
              className="form-input"
              placeholder="e.g. Java 17, Spring Boot, MySQL, React, RESTful APIs"
              value={formData.skillsRequired}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Job Description & Responsibilities *</label>
            <textarea
              id="description"
              name="description"
              rows="8"
              className="form-input"
              placeholder="Detail the daily responsibilities, qualifications, tech stack, and interview process..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
            <Link to="/recruiter/jobs" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ minWidth: '150px' }}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Position' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
