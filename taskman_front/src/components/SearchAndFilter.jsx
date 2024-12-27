import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filters,
  className = "" 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 
                     text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 
                     dark:ring-gray-700 placeholder:text-gray-400 
                     focus:ring-2 focus:ring-inset focus:ring-indigo-600 
                     dark:bg-gray-900/50 dark:focus:ring-indigo-500
                     sm:text-sm sm:leading-6"
            placeholder="Search users..."
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-4 md:col-span-7">
          {filters.map((filter) => (
            <div key={filter.name} className="flex-1">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="block w-full rounded-lg border-0 py-2.5 pl-3 pr-10 
                         text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 
                         dark:ring-gray-700 focus:ring-2 focus:ring-inset 
                         focus:ring-indigo-600 dark:bg-gray-900/50 
                         dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 