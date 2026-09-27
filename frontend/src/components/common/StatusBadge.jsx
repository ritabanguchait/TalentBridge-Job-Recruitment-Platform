import React from 'react';

/**
 * Renders consistent, styled status pill badges for jobs, applications, and role types.
 */
const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  const getBadgeClass = (s) => {
    switch (s) {
      case 'APPLIED':
        return 'badge-applied';
      case 'UNDER_REVIEW':
        return 'badge-under-review';
      case 'SHORTLISTED':
        return 'badge-shortlisted';
      case 'INTERVIEW':
      case 'INTERVIEW_SCHEDULED':
        return 'badge-interview';
      case 'SELECTED':
        return 'badge-selected';
      case 'REJECTED':
        return 'badge-rejected';
      case 'WITHDRAWN':
        return 'badge-withdrawn';
      case 'OPEN':
        return 'badge-open';
      case 'CLOSED':
        return 'badge-closed';
      case 'ROLE_ADMIN':
      case 'ADMIN':
        return 'badge-admin';
      case 'ROLE_RECRUITER':
      case 'RECRUITER':
        return 'badge-recruiter';
      case 'ROLE_CANDIDATE':
      case 'CANDIDATE':
        return 'badge-candidate';
      case 'FULL_TIME':
      case 'PART_TIME':
      case 'CONTRACT':
      case 'INTERNSHIP':
        return 'badge-applied';
      case 'ENTRY_LEVEL':
      case 'MID_LEVEL':
      case 'SENIOR_LEVEL':
        return 'badge-shortlisted';
      default:
        return 'badge-applied';
    }
  };

  const formatLabel = (s) => {
    if (s.startsWith('ROLE_')) {
      s = s.replace('ROLE_', '');
    }
    return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <span className={`badge ${getBadgeClass(normalized)}`}>
      {formatLabel(normalized)}
    </span>
  );
};

export default StatusBadge;
