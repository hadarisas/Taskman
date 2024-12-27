import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const CreateTeamModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({ name });
      setName('');
      onClose();
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl transform transition-all">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Team
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
                       transition-colors duration-150"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Team Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                           pr-10 focus:border-indigo-500 focus:ring-indigo-500 
                           dark:bg-gray-700 dark:text-white sm:text-sm transition-colors 
                           duration-150 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter team name..."
                  required
                  minLength={3}
                  maxLength={50}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <UserGroupIcon 
                    className="h-5 w-5 text-gray-400 dark:text-gray-500" 
                    aria-hidden="true" 
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Choose a unique name for your team. This will be visible to all team members.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 -m-6 mt-6 p-4 flex justify-end space-x-3 
                          border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                         rounded-md border border-gray-300 dark:border-gray-600 
                         transition-colors duration-150 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                         hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors duration-150
                         dark:focus:ring-offset-gray-800"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg 
                      className="animate-spin h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Team'
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateTeamModal; 