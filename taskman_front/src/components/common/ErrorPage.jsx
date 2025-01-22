import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ErrorPage = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 
                      bg-red-100 dark:bg-red-900/30 rounded-lg">
          <ExclamationTriangleIcon 
            className="w-8 h-8 text-red-600 dark:text-red-400" 
            aria-hidden="true" 
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {message || "We encountered an error while loading the data. Please try again."}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent 
                   text-sm font-medium rounded-lg text-white bg-indigo-600 
                   hover:bg-indigo-500 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 
                   transition-colors duration-200"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage; 