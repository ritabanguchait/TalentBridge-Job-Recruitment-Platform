import React from 'react';

/**
 * Renders consistent, styled status pill badges for jobs and application lifecycle states.
 */
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getBadgeClass = (s) => {
    switch (s) {
      case 'APPLIED':
        return 'badge-applied';
      case 'UNDER_REVIEW':
        return 'badge-under-review';
      case 'SHORTLISTED':
        return 'badge-shortlisted';
      case 'INTERVIEW':
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
      default:
        return 'badge-applied';
    }
  };

  const formatLabel = (s) => {
    return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <span className={`badge ${getBadgeClass(normalized)}`}>
      {formatLabel(normalized)}
    </span>
  );
};

export default StatusBadge;
