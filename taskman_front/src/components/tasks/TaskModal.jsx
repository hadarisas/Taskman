import React, { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers } from '../../store/slices/usersSlice';
import { fetchUsers } from '../../store/slices/usersSlice'; // Make sure this action exists

const TaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  
  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsers());
    }
  }, [isOpen, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      startDate: task?.startDate || "",
      dueDate: task?.dueDate || "",
      status: task?.status || "TODO",
      priority: task?.priority || "MEDIUM",
      assigneeId: task?.assigneeId || "",
    },
  });

  // Watch start date to validate due date
  const startDate = watch("startDate");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        startDate: task.startDate || "",
        dueDate: task.dueDate || "",
        status: task.status || "TODO",
        priority: task.priority || "MEDIUM",
        assigneeId: task.assigneeId || "",
      });
    }
  }, [task, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <ClipboardDocumentIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                {task ? "Edit Task" : "Create Task"}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-6 space-y-6"
          >
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Task title is required",
                  minLength: {
                    value: 3,
                    message: "Task title must be at least 3 characters",
                  },
                })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="DONE">Done</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate", {
                    validate: (value) =>
                      !startDate ||
                      !value ||
                      new Date(value) >= new Date(startDate) ||
                      "Due date must be after start date",
                  })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <select
                {...register("assigneeId")}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              >
                <option value="">Select assignee...</option>
                {users && users.length > 0 ? (
                  users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading users...</option>
                )}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 
                                 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                                 focus-visible:outline focus-visible:outline-2 
                                 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                                 dark:bg-indigo-500 dark:hover:bg-indigo-400 
                                 transition-colors duration-200"
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : task
                  ? "Update Task"
                  : "Create Task"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal;
