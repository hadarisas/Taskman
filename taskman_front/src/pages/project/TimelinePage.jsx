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
  const [timelineView, setTimelineView] = useState('month');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const data = await TaskService.getAllTasks(projectId);
      setTasks(data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = () => {
    if (!tasks.length) return [];
    
    const startDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate))));
    const endDate = new Date(Math.max(...tasks.map(t => new Date(t.dueDate))));
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + (timelineView === 'week' ? 1 : 7));
    }
    
    return dates;
  };

  const getTaskPosition = (task) => {
    const dates = getDateRange();
    if (!dates.length) return { left: 0, width: 0 };
    
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.dueDate);
    const totalDays = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24);
    
    const left = ((startDate - dates[0]) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const width = (endDate - startDate) / (1000 * 60 * 60 * 24) / totalDays * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const statusColors = {
    TODO: 'bg-gray-200 dark:bg-gray-700',
    IN_PROGRESS: 'bg-blue-200 dark:bg-blue-700',
    REVIEW: 'bg-yellow-200 dark:bg-yellow-700',
    DONE: 'bg-green-200 dark:bg-green-700',
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

      {/* Gantt Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mt-6">
        <div className="relative min-h-[400px]">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2">
            <div className="w-1/4">Task</div>
            <div className="w-3/4 flex">
              {getDateRange().map((date, index) => (
                <div key={index} className="flex-1 text-xs text-center">
                  {date.toLocaleDateString(undefined, { 
                    month: 'numeric', 
                    day: 'numeric' 
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="mt-4 space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center">
                <div className="w-1/4 pr-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                </div>
                <div className="w-3/4 relative h-6">
                  <div
                    className={`absolute h-full rounded-full ${statusColors[task.status]}`}
                    style={getTaskPosition(task)}
                  >
                    <div className="px-2 py-1 text-xs truncate">
                      {task.title}
                    </div>
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