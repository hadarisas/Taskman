import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const MEMBER_ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'VIEWER', label: 'Viewer' }
];

const TeamMembersModal = ({ isOpen, onClose, onSubmit, team, availableUsers }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      members: []
    }
  });

  const handleFormSubmit = (data) => {
    const formattedMembers = data.members.map(member => ({
      userId: member.value,
      role: member.role.value
    }));
    onSubmit(formattedMembers);
    reset();
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: '#374151',
      '&:hover': {
        borderColor: '#4F46E5'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1F2937',
      border: '1px solid #374151'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4F46E5' : state.isFocused ? '#374151' : 'transparent',
      color: '#F3F4F6',
      '&:hover': {
        backgroundColor: '#374151'
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="relative w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Add Team Members
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300
                               transition-colors duration-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Members and Roles
                      </label>
                      <Controller
                        name="members"
                        control={control}
                        rules={{ required: 'Please select at least one member' }}
                        render={({ field }) => (
                          <div className="space-y-4">
                            {field.value.map((member, index) => (
                              <div key={index} className="flex gap-4">
                                <div className="flex-grow">
                                  <Select
                                    value={availableUsers.find(user => user.value === member.value)}
                                    onChange={(selected) => {
                                      const newMembers = [...field.value];
                                      newMembers[index] = {
                                        ...newMembers[index],
                                        value: selected.value,
                                        label: selected.label
                                      };
                                      field.onChange(newMembers);
                                    }}
                                    options={availableUsers}
                                    styles={customSelectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                  />
                                </div>
                                <div className="w-32">
                                  <Select
                                    value={MEMBER_ROLES.find(role => role.value === member.role?.value)}
                                    onChange={(selected) => {
                                      const newMembers = [...field.value];
                                      newMembers[index] = {
                                        ...newMembers[index],
                                        role: selected
                                      };
                                      field.onChange(newMembers);
                                    }}
                                    options={MEMBER_ROLES}
                                    styles={customSelectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMembers = field.value.filter((_, i) => i !== index);
                                    field.onChange(newMembers);
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange([
                                  ...field.value,
                                  { role: MEMBER_ROLES[1] } // Default to MEMBER role
                                ]);
                              }}
                              className="text-sm text-indigo-600 dark:text-indigo-400 
                                       hover:text-indigo-500 dark:hover:text-indigo-300"
                            >
                              + Add another member
                            </button>
                          </div>
                        )}
                      />
                      {errors.members && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.members.message}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                                 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                 dark:focus:ring-indigo-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 
                                 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                                 focus-visible:outline focus-visible:outline-2 
                                 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                                 dark:bg-indigo-500 dark:hover:bg-indigo-400 
                                 transition-colors duration-200"
                      >
                        Add Members
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TeamMembersModal; 