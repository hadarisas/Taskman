import React, { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import Button from "../common/Button";

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
      status: project?.status || "NOT_STARTED",
      priority: project?.priority || "MEDIUM",
      estimatedHours: project?.estimatedHours || "",
    },
  });

  // Watch start date to validate end date
  const startDate = watch("startDate");

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        priority: project.priority || "MEDIUM",
        estimatedHours: project.estimatedHours || "",
      });
    }
  }, [project, reset]);

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
                <DocumentIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                {project ? "Edit Project" : "Create Project"}
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
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Project name is required",
                  minLength: {
                    value: 3,
                    message: "Project name must be at least 3 characters",
                  },
                })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
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

            {/* Priority */}
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

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  {...register("endDate", {
                    required: "End date is required",
                    validate: (value) =>
                      !startDate ||
                      new Date(value) >= new Date(startDate) ||
                      "End date must be after start date",
                  })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
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
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : project
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProjectModal;
