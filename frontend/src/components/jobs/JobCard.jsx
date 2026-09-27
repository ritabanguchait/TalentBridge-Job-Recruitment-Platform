import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Calendar, ArrowRight, Building2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import './JobCard.css';

const JobCard = ({ job }) => {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
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

  const companyInitial = job.companyName
    ? job.companyName.charAt(0).toUpperCase()
    : 'C';

  // Format relative or date string
  const formatPostDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="job-card card card-hover">
      <div className="job-card-top">
        <div className="job-company-avatar" aria-hidden="true">
          {companyInitial}
        </div>
        <div className="job-title-group">
          <h3 className="job-card-title">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <div className="job-card-company">
            <Building2 size={13} className="inline-icon" />
            <span>{job.companyName || 'Confidential Employer'}</span>
          </div>
        </div>
        <div className="job-badge-wrap">
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="job-card-meta">
        <span className="meta-pill" title="Job Location">
          <MapPin size={13} />
          <span>{job.location}</span>
        </span>
        <span className="meta-pill" title="Employment Type">
          <Briefcase size={13} />
          <span>{job.jobType?.replace(/_/g, ' ')}</span>
        </span>
        <span className="meta-pill" title="Experience Level">
          <Clock size={13} />
          <span>{job.experienceLevel?.replace(/_/g, ' ')}</span>
        </span>
      </div>

      <div className="job-card-salary">
        <span className="salary-label">Compensation</span>
        <span className="salary-amount">{formatSalary(job.salaryMin, job.salaryMax)}</span>
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

      <div className="job-card-footer">
        <span className="job-posted-time">
          <Calendar size={13} />
          <span>Posted {formatPostDate(job.createdAt)}</span>
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm job-action-btn">
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
