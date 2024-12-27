import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white dark:bg-gray-800 
      shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
      border border-gray-200 dark:border-gray-700 
      rounded-lg p-6
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card; 