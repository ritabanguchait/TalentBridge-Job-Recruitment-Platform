import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label="Loading"></div>
      {text && <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
