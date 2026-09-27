import React from 'react';

const LoadingSpinner = ({ text = 'Loading data...', size = 'default' }) => {
  const spinnerStyle = size === 'sm' ? { width: 24, height: 24, borderWidth: 2.5 } : {};

  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" style={spinnerStyle} aria-label="Loading"></div>
      {text && (
        <p style={{ color: 'var(--text-muted)', fontSize: size === 'sm' ? '0.8rem' : '0.885rem', fontWeight: 500 }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
