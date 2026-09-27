import React from 'react';

const EmptyState = ({ title = 'No records found', message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">📁</div>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--navy-900)' }}>{title}</h3>
      {message && <p className="text-muted" style={{ maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>{message}</p>}
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
