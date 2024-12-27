import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import Button from '../Button';

const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'In Review',
  DONE: 'Done',
  CANCELLED: 'Cancelled'
};

const PRIORITY_OPTIONS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

const TaskModal = ({ isOpen, onClose, onSubmit, task, projectId }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'TODO',
      priority: task?.priority || 'MEDIUM',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
      assigneeId: task?.assigneeId || ''
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, projectId });
    reset();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Create Task'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                >
                  {Object.entries(TASK_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           text-gray-900 dark:text-white"
                >
                  {Object.entries(PRIORITY_OPTIONS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                         text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal; 