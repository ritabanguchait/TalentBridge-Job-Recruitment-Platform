import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import './JobCard.css';

const JobCard = ({ job }) => {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary undisclosed';
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `From ${formatter.format(min)}`;
    return `Up to ${formatter.format(max)}`;
  };

  const skillsList = job.skillsRequired
    ? job.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="job-card card">
      <div className="job-card-header">
        <div className="job-title-group">
          <h3 className="job-card-title">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="job-card-company">{job.companyName || 'Confidential'}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="job-card-meta">
        <span className="meta-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {job.location}
        </span>
        <span className="meta-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          {job.jobType?.replace('_', ' ')}
        </span>
        <span className="meta-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {job.experienceLevel?.replace('_', ' ')}
        </span>
      </div>

      <div className="job-card-salary">
        <strong>{formatSalary(job.salaryMin, job.salaryMax)}</strong>
      </div>

      {skillsList.length > 0 && (
        <div className="job-skills-tags">
          {skillsList.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {skillsList.length > 4 && (
            <span className="skill-tag-more">+{skillsList.length - 4} more</span>
          )}
        </div>
      )}

      <div className="job-card-actions">
        <span className="job-posted-time">
          Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
