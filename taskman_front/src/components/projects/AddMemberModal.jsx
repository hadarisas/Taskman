import React from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import Button from "../common/Button";

const AddMemberModal = ({ isOpen, onClose, onAdd, existingMembers, users }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userId: "",
      role: "MEMBER",
    },
  });

  const availableUsers = users.filter(user => !existingMembers.includes(user.id));

  const handleFormSubmit = async (data) => {
    await onAdd(data.userId, data.role);
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Project Member
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select User *
              </label>
              <select
                {...register("userId", {
                  required: "Please select a user",
                })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              >
                <option value="">Select a user...</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 
                                 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                                 focus-visible:outline focus-visible:outline-2 
                                 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                                 dark:bg-indigo-500 dark:hover:bg-indigo-400 
                                 transition-colors duration-200" 
              type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddMemberModal;