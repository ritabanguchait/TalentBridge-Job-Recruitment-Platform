import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import JobCard from './components/jobs/JobCard';

function HomePage() {
  const sampleJob = {
    id: 1,
    title: 'Junior Java Full-Stack Developer',
    companyName: 'TechFlow Solutions',
    location: 'Bangalore / Hybrid',
    jobType: 'FULL_TIME',
    experienceLevel: 'ENTRY_LEVEL',
    salaryMin: 500000,
    salaryMax: 800000,
    skillsRequired: 'Java, Spring Boot, MySQL, React',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '3.5rem 1rem', maxWidth: '750px', margin: '0 auto' }}>
        <span className="badge badge-interview" style={{ marginBottom: '1rem' }}>
          Platform Online &bull; Phase 7 Ready
        </span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          Connect with Opportunities that Match Your Talents
        </h1>
        <p className="text-muted" style={{ fontSize: '1.15rem', marginBottom: '2rem' }}>
          A realistic, full-stack recruitment platform connecting job seekers, tech recruiters, and hiring managers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/jobs" className="btn btn-primary btn-lg">
            Explore Open Jobs &rarr;
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            Join Platform
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ marginBottom: '1.25rem' }}>Featured Position Preview</h2>
        <div style={{ maxWidth: '650px' }}>
          <JobCard job={sampleJob} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<HomePage />} />
        <Route path="login" element={<div className="container" style={{ padding: '3rem 0' }}><h2>Login Screen (Phase 8)</h2></div>} />
        <Route path="register" element={<div className="container" style={{ padding: '3rem 0' }}><h2>Registration Screen (Phase 8)</h2></div>} />
      </Route>
    </Routes>
  );
}

export default App;
