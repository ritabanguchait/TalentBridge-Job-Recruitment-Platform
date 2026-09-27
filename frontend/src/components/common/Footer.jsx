import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-col footer-about">
          <div className="footer-brand">
            <div className="footer-logo-icon">
              <Briefcase size={18} strokeWidth={2.4} />
            </div>
            <span className="brand-name">Talent<span className="brand-accent">Bridge</span></span>
          </div>
          <p className="footer-desc">
            The next-generation recruitment platform connecting high-growth tech teams with top software engineering talent. Transparent hiring workflows and real-time candidate updates.
          </p>
          <div className="footer-system-status">
            <span className="status-indicator"></span>
            <span className="status-text">All systems operational</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">For Job Seekers</h4>
          <ul className="footer-list">
            <li><Link to="/jobs">Explore All Roles</Link></li>
            <li><Link to="/candidate/dashboard">Candidate Dashboard</Link></li>
            <li><Link to="/candidate/profile">Profile & Skills Builder</Link></li>
            <li><Link to="/candidate/applications">Track Applications</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">For Employers</h4>
          <ul className="footer-list">
            <li><Link to="/recruiter/post-job">Post an Opening</Link></li>
            <li><Link to="/recruiter/jobs">Manage Listings</Link></li>
            <li><Link to="/recruiter/applicants">Review Applicant Pipeline</Link></li>
            <li><Link to="/recruiter/dashboard">Recruiter Hub</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Developer API</h4>
          <ul className="footer-list">
            <li>
              <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="api-link">
                <span>Swagger UI</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="http://localhost:8080/v3/api-docs" target="_blank" rel="noopener noreferrer" className="api-link">
                <span>OpenAPI v3 Spec</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Free Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} TalentBridge Recruitment Platform. Built with Spring Boot & React.
          </p>
          <div className="footer-badges">
            <span className="tech-badge">Java 17</span>
            <span className="tech-badge">Spring Boot 3</span>
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
