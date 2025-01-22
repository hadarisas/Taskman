import React from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'danger' // 'danger' | 'warning' | 'success'
}) => {
  const styleMap = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirmation action:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 
                               shadow-xl">
          <div className="p-4 sm:p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon 
                  className={`h-6 w-6 ${
                    confirmStyle === 'danger' 
                      ? 'text-red-600' 
                      : confirmStyle === 'warning'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                />
              </div>
              <div className="ml-3">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                         border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         dark:focus:ring-offset-gray-800 ${styleMap[confirmStyle]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog; 