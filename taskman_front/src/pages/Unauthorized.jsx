import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <ShieldExclamationIcon className="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400" />
        <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md 
                     bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
                     shadow-sm hover:bg-indigo-500 focus-visible:outline 
                     focus-visible:outline-2 focus-visible:outline-offset-2 
                     focus-visible:outline-indigo-600 dark:bg-indigo-500 
                     dark:hover:bg-indigo-400 transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 