import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { TaskService } from '../../services/TaskService';

const TimelinePage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timelineView, setTimelineView] = useState('month'); // 'month' or 'week'

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const data = await TaskService.getAllTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Timeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track project progress and milestones
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimelineView('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              timelineView === 'week' 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimelineView('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              timelineView === 'month'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {tasks.map((task) => (
              <div key={task.id} className="relative pl-12">
                {/* Timeline Dot */}
                <div className={`absolute left-2 -translate-x-1/2 w-6 h-6 rounded-full 
                              flex items-center justify-center
                              ${task.status === 'DONE'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                              }`}>
                  {task.status === 'DONE' ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                {/* Task Content */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {task.priority.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h4>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h4>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
            {tasks.filter(t => t.status === 'DONE').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h4>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {tasks.filter(t => t.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h4>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
            {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'DONE').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage; 