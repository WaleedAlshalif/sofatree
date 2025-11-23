import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClass = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  }[size];

  return (
    <div className={`loading-container ${sizeClass}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;