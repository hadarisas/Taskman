import React, { useState, useEffect } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    active: true
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
        role: user.role || 'USER',
        active: user.active ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        active: true
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      password: formData.password || undefined,
      role: formData.role,
      active: formData.active
    };
    onSubmit(submitData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-6">
                      {user ? 'Edit User' : 'Create New User'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white 
                                   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                   placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                   focus:ring-indigo-600 dark:bg-gray-900/50 
                                   dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white 
                                   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                   placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                   focus:ring-indigo-600 dark:bg-gray-900/50 
                                   dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {user ? 'Password (leave blank to keep current)' : 'Password'}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white 
                                     shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                     placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                     focus:ring-indigo-600 dark:bg-gray-900/50 
                                     dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 pr-10"
                            required={!user}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Role and Active Status in a grid */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Role Field */}
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white 
                                     shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                     focus:ring-2 focus:ring-inset focus:ring-indigo-600 
                                     dark:bg-gray-900/50 dark:focus:ring-indigo-500 
                                     sm:text-sm sm:leading-6"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                          </select>
                        </div>

                        {/* Active Status Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                          </label>
                          <div className="flex items-center h-[38px]">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                          peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full 
                                          peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                                          peer-checked:after:border-white after:content-[''] after:absolute 
                                          after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                          after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                                          dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex items-center justify-end gap-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="inline-flex justify-center rounded-md bg-white dark:bg-gray-900 
                                   px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 
                                   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                   hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 
                                   text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                                   focus-visible:outline focus-visible:outline-2 
                                   focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          {user ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserModal; 