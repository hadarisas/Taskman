import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "USER",
      active: user?.active ?? true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        active: user.active,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

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
                        <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user ? "Edit User" : "Create New User"}
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

                  <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="block w-full rounded-lg border-0 py-2.5 px-2 text-gray-900 dark:text-white 
                                 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                 focus:ring-indigo-600 dark:bg-gray-900/50 
                                 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="block w-full rounded-lg border-0 py-2.5 px-2 text-gray-900 dark:text-white 
                                 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                 focus:ring-indigo-600 dark:bg-gray-900/50 
                                 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password {user && "(leave blank to keep current)"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: user ? false : "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className="block w-full rounded-lg border-0 py-2.5 pr-10 pl-2 text-gray-900 dark:text-white 
                                   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                   placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                                   focus:ring-indigo-600 dark:bg-gray-900/50 
                                   dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 
                                   hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        {...register("role")}
                        className="block w-full rounded-lg border-0 py-2.5 px-2 text-gray-900 dark:text-white 
                                 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
                                 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-900/50 
                                 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("active")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 
                                 focus:ring-indigo-600 dark:border-gray-600 
                                 dark:focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Active
                      </label>
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
                        {user ? "Update User" : "Create User"}
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

export default UserModal;
