import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Building,
  Sparkles
} from 'lucide-react';
import jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await jobService.searchJobs({ page: 0, size: 4 });
        setFeaturedJobs(data.content || []);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword.trim()) query.set('keyword', keyword.trim());
    if (location.trim()) query.set('location', location.trim());
    navigate(`/jobs?${query.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section home-hero-section" style={{ position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          {/* Eyebrow Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.95rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Sparkles size={14} className="text-primary" />
            <span>Next-Generation Recruitment Platform</span>
          </div>

          <h1 style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.035em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Connecting Elite Tech Talent with <span style={{ color: 'var(--primary-600)' }}>Top Engineering Teams</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '680px', marginInline: 'auto' }}>
            Discover transparent job openings, apply directly with structured candidate profiles, and monitor your recruitment stages in real time.
          </p>

          {/* Unified Hero Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="home-search-panel"
          >
            <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0 0.85rem', borderRight: '1px solid var(--border-default)' }}>
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                className="form-input"
                style={{ border: 'none', boxShadow: 'none', padding: '0.65rem 0', background: 'transparent' }}
                placeholder="Job title, skill, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0 0.85rem' }}>
              <MapPin size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                className="form-input"
                style={{ border: 'none', boxShadow: 'none', padding: '0.65rem 0', background: 'transparent' }}
                placeholder="Location or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-lg)' }}>
              <Search size={16} />
              <span>Search Opportunities</span>
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Popular Searches:</span>
            {['Java', 'Spring Boot', 'React', 'Full Time', 'Remote', 'Bangalore'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--surface-card)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.775rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.color = 'var(--primary-600)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Key Metrics Strip */}
      <section className="home-section-surface" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>Verified Employers</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)', letterSpacing: '-0.02em' }}>Transparent</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>Published Salary Brackets</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Live</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>Real-time Status Timelines</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Zero Spam</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>Direct Candidate-Recruiter Link</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
              Handpicked Positions
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)' }}>Featured Job Openings</h2>
            <p className="text-muted" style={{ marginTop: '0.25rem' }}>
              Explore newly published engineering roles from verified hiring companies.
            </p>
          </div>
          <Link to="/jobs" className="btn btn-outline btn-sm">
            <span>View All Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching open positions..." />
        ) : featuredJobs.length > 0 ? (
          <div className="grid-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="card card-body" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <p className="text-muted">No open jobs at this time. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Value Pillars / Feature Cards */}
      <section className="home-section-surface" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.65rem', color: 'var(--text-primary)' }}>Why Modern Teams Choose TalentBridge</h2>
            <p className="text-muted">A structured, dependable recruitment process designed for clarity and efficiency.</p>
          </div>

          <div className="grid-3">
            <div className="card card-body" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <TrendingUp size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Live Pipeline Stepper</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every application features a timestamped audit trail. Track when your resume is reviewed, shortlisted, or when interviews are arranged.
              </p>
            </div>

            <div className="card card-body" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Verified Tech Stack Match</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Positions are indexed by precise programming languages, frameworks, and seniority requirements to avoid mismatched applications.
              </p>
            </div>

            <div className="card card-body" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--purple-50)', color: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Direct Recruiter Notes</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                No automated black holes. Recruiters attach interview schedules, meeting links, and constructive remarks directly to your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Proposition Section */}
      <section className="container" style={{ padding: '4.5rem 1.5rem' }}>
        <div className="grid-2">
          {/* Candidate Card */}
          <div className="card card-body home-cta-card-candidate" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-candidate" style={{ marginBottom: '1.25rem' }}>
                For Job Seekers
              </span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Accelerate Your Tech Career
              </h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Create a structured developer profile with your tech stack, portfolio, and resume. Apply to transparent roles with one click and track feedback at each stage.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Transparent compensation ranges</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Real-time status notifications and timeline</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Direct submission pitch notes to hiring managers</span>
                </li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              <span>Build Seeker Profile</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Recruiter Card */}
          <div className="card card-body home-cta-card-recruiter" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-recruiter" style={{ marginBottom: '1.25rem' }}>
                For Employers & Recruiters
              </span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Hire Qualified Developers Fast
              </h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Publish detailed job requirements, evaluate applicant profiles and resumes, manage pipeline stages, and transition statuses with custom remarks.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Centralized applicant dossiers with resume links</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>5-stage progression pipeline (Under Review to Hired)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Rich candidate pitch note review</span>
                </li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <span>Start Hiring Today</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
