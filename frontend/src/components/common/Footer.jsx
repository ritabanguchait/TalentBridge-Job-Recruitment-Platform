import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-col footer-about">
          <div className="footer-brand">
            <span className="brand-name">Talent<span className="brand-accent">Bridge</span></span>
          </div>
          <p className="footer-desc">
            A modern, transparent recruitment platform bridging ambitious professionals with leading employers.
          </p>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} TalentBridge Inc. All rights reserved.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">For Job Seekers</h4>
          <ul className="footer-list">
            <li><Link to="/jobs">Search Jobs</Link></li>
            <li><Link to="/candidate/dashboard">Candidate Dashboard</Link></li>
            <li><Link to="/candidate/profile">Profile Builder</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">For Employers</h4>
          <ul className="footer-list">
            <li><Link to="/recruiter/post-job">Post a Job</Link></li>
            <li><Link to="/recruiter/jobs">Manage Postings</Link></li>
            <li><Link to="/recruiter/applicants">Review Applicants</Link></li>
            <li><Link to="/recruiter/dashboard">Recruiter Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-list">
            <li><a href="/swagger-ui.html" target="_blank" rel="noopener noreferrer">API Documentation</a></li>
            <li><a href="/v3/api-docs" target="_blank" rel="noopener noreferrer">OpenAPI Spec</a></li>
            <li><Link to="/login">Sign In</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
