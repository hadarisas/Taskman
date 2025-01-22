import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange 
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t 
                    border-gray-200 dark:border-gray-700 shadow-lg z-[5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile pagination */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md bg-white dark:bg-gray-900 px-4 py-2 
                       text-sm font-medium text-gray-700 dark:text-gray-200 ring-1 ring-inset 
                       ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md bg-white dark:bg-gray-900 
                       px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 ring-1 
                       ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 
                       dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors duration-200"
            >
              Next
            </button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Items per page selector */}
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white 
                         ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 
                         focus:ring-inset focus:ring-indigo-600 dark:bg-gray-900 
                         dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>

              {/* Page navigation */}
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 
                           ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 
                           dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                              ${currentPage === page
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                      } transition-colors duration-200`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 
                           ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 
                           dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 