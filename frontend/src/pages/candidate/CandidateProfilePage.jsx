import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
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
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSpinner text="Loading candidate profile details..." />
      </div>
    );
  }

  // Calculate profile completeness percentage
  const fields = [formData.headline, formData.phone, formData.location, formData.skills, formData.education, formData.resumeUrl];
  const filledFields = fields.filter((f) => f && String(f).trim().length > 0).length;
  const completenessPct = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '820px' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Account</span>
            <span>&bull;</span>
            <span>Credentials</span>
          </div>
          <h1 className="page-title">Candidate Profile & Dossier</h1>
          <p className="page-subtitle">
            This information is automatically attached to every job application you submit.
          </p>
        </div>

        {/* Profile Completeness Pill */}
        <div 
          style={{ 
            backgroundColor: 'var(--surface-card)', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '0.75rem 1.25rem', 
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 600 }}>Profile Strength</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: completenessPct >= 80 ? 'var(--emerald-600)' : 'var(--primary-600)' }}>
              {completenessPct}% Complete
            </div>
          </div>
          <div 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              background: `conic-gradient(var(--primary-600) ${completenessPct}%, var(--border-default) 0)`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--surface-card)' }} />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1.75rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Professional Headline */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Professional Identity
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="headline">
              Professional Headline / Role Title
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="headline"
                name="headline"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. Senior Java Full-Stack Engineer | Spring Boot, React, AWS"
                value={formData.headline}
                onChange={handleChange}
                maxLength={150}
              />
              <Briefcase size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
            <small className="form-hint">A clear summary of your primary technical focus and core seniority.</small>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="experienceYears">
                Years of Relevant Experience
              </label>
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
              <label className="form-label" htmlFor="education">
                Highest Degree / Education
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="education"
                  name="education"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. B.Tech in Computer Science, 2024"
                  value={formData.education}
                  onChange={handleChange}
                  maxLength={200}
                />
                <GraduationCap size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Location & Contact
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={30}
                />
                <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Current Location
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. Bangalore, India (Open to Remote)"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={120}
                />
                <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Technical Skillset
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Declared Technologies & Skills (Comma separated)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="skills"
                name="skills"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. Java 17, Spring Boot, MySQL, React, REST API, Git, Docker, Kubernetes"
                value={formData.skills}
                onChange={handleChange}
              />
              <Code size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
            <small className="form-hint">Used by employers for automated candidate keyword matching</small>
          </div>

          {/* Live Skills Tag Preview */}
          {formData.skills && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {formData.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: External Links & Documents */}
        <div className="card card-body" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Resume & Portfolio Links
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="resumeUrl">
              Resume Document Link (Google Drive, Dropbox, Hosted PDF)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="https://drive.google.com/file/d/your-resume-id/view"
                value={formData.resumeUrl}
                onChange={handleChange}
                maxLength={255}
              />
              <FileText size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="portfolioUrl">
              GitHub Profile / Personal Portfolio Website
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="https://github.com/your-username"
                value={formData.portfolioUrl}
                onChange={handleChange}
                maxLength={255}
              />
              <Globe size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{ minWidth: '180px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfilePage;
