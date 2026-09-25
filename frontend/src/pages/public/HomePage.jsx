import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '4.5rem 0 5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <span className="badge badge-interview" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.95rem' }}>
            Next-Generation Recruitment Platform
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Find Your Next Career Move on <span className="text-primary">TalentBridge</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Connecting skilled tech talent with leading software companies. Search transparent postings, apply with ease, and track your interview journey step-by-step.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="card" style={{ padding: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', boxShadow: 'var(--shadow-md)' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: '1 1 240px', border: 'none', background: 'var(--surface-subtle)' }}
              placeholder="Job title, skill, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              style={{ flex: '1 1 180px', border: 'none', background: 'var(--surface-subtle)' }}
              placeholder="Location or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="container" style={{ padding: '3.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem' }}>Latest Opportunities</h2>
            <p className="text-muted">Explore newly posted roles from verified companies.</p>
          </div>
          <Link to="/jobs" className="btn btn-outline btn-sm">
            View All Jobs &rarr;
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
          <div className="card card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-muted">No open jobs at this time. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Dual Value Proposition */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '4rem 0' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card card-body" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #bbf7d0' }}>
              <span className="badge badge-selected" style={{ marginBottom: '1rem' }}>For Job Seekers</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Accelerate Your Job Hunt</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Create a rich developer profile, apply to curated roles with a single click, and follow your live application status with complete transparency.
              </p>
              <Link to="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                Create Seeker Profile
              </Link>
            </div>

            <div className="card card-body" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, #eff6ff 0%, #ffffff 100%)', border: '1px solid #bfdbfe' }}>
              <span className="badge badge-applied" style={{ marginBottom: '1rem' }}>For Recruiters</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Hire Qualified Developers Fast</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Publish detailed job requirements, review applicant profiles, manage recruitment pipelines, and transition statuses with custom remarks.
              </p>
              <Link to="/register" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                Start Hiring Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
