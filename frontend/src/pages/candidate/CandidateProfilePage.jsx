import React, { useState, useEffect } from 'react';
import applicationService from '../../services/applicationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CandidateProfilePage = () => {
  const [formData, setFormData] = useState({
    headline: '',
    phone: '',
    location: '',
    skills: '',
    experienceYears: 0,
    education: '',
    resumeUrl: '',
    portfolioUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getCandidateProfile();
        if (data) {
          setFormData({
            headline: data.headline || '',
            phone: data.phone || '',
            location: data.location || '',
            skills: data.skills || '',
            experienceYears: data.experienceYears !== undefined && data.experienceYears !== null ? data.experienceYears : 0,
            education: data.education || '',
            resumeUrl: data.resumeUrl || '',
            portfolioUrl: data.portfolioUrl || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setErrorMessage('Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experienceYears' ? (value === '' ? '' : parseInt(value, 10)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears) || 0,
      };
      await applicationService.updateCandidateProfile(payload);
      setSuccessMessage('Your candidate profile was successfully updated!');
    } catch (err) {
      console.error('Failed to save profile', err);
      const msg = err.response?.data?.message || 'Failed to save changes. Please check input lengths.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem' }}>
        <LoadingSpinner text="Loading candidate profile details..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '780px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
          Candidate Profile & Credentials
        </h1>
        <p className="text-muted">
          Keep your developer profile accurate and compelling so tech recruiters can quickly assess your skills.
        </p>
      </div>

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      <div className="card card-body" style={{ padding: '2.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="headline">
              Professional Headline
            </label>
            <input
              id="headline"
              name="headline"
              type="text"
              className="form-input"
              placeholder="e.g. Junior Java Full-Stack Developer | Spring Boot, React, MySQL"
              value={formData.headline}
              onChange={handleChange}
              maxLength={150}
            />
            <small className="text-muted">A clear, concise summary of your primary technical focus.</small>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Current Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Bangalore, India (Open to Remote)"
                value={formData.location}
                onChange={handleChange}
                maxLength={120}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="experienceYears">Years of Experience</label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                max="50"
                className="form-input"
                value={formData.experienceYears}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="education">Highest Education / Degree</label>
              <input
                id="education"
                name="education"
                type="text"
                className="form-input"
                placeholder="e.g. B.Tech in Computer Science, 2024"
                value={formData.education}
                onChange={handleChange}
                maxLength={200}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">Technical Skills (Comma separated)</label>
            <input
              id="skills"
              name="skills"
              type="text"
              className="form-input"
              placeholder="e.g. Java 17, Spring Boot, Hibernate, MySQL, React, REST API, Git, Docker"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="resumeUrl">Resume Link (Google Drive / Dropbox / Hosted PDF)</label>
            <input
              id="resumeUrl"
              name="resumeUrl"
              type="url"
              className="form-input"
              placeholder="https://drive.google.com/file/d/your-resume-id/view"
              value={formData.resumeUrl}
              onChange={handleChange}
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="portfolioUrl">Portfolio / GitHub Profile URL</label>
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              className="form-input"
              placeholder="https://github.com/your-username"
              value={formData.portfolioUrl}
              onChange={handleChange}
              maxLength={255}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ minWidth: '160px' }}
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
