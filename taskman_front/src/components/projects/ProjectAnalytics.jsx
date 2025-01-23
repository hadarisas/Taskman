import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { ProjectService } from '../../services/ProjectService';
import { TaskService } from '../../services/TaskService';

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const [analytics, setAnalytics] = useState({
    taskStats: {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0
    },
    teamStats: {
      totalMembers: 0,
      activeMembers: 0
    },
    timeStats: {
      estimatedHours: 0,
      actualHours: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [projectId]);

  const fetchAnalyticsData = async () => {
    try {
      const [taskStats, teamStats, timeStats] = await Promise.all([
        TaskService.getTaskStats(projectId),
        ProjectService.getTeamStats(projectId),
        ProjectService.getTimeStats(projectId)
      ]);
      
      setAnalytics({ taskStats, teamStats, timeStats });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Progress */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Task Progress
              </h3>
              <p className="mt-1 text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {Math.round((analytics.taskStats.completed / analytics.taskStats.total) * 100)}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 rounded-full h-2"
                style={{ width: `${(analytics.taskStats.completed / analytics.taskStats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Time Spent
              </h3>
              <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
                {analytics.timeStats.actualHours}h
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            of {analytics.timeStats.estimatedHours}h estimated
          </p>
        </div>

        {/* Team Activity */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Active Members
              </h3>
              <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {analytics.teamStats.activeMembers}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            of {analytics.teamStats.totalMembers} team members
          </p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Task Distribution
          </h3>
          {/* Add task distribution chart here */}
        </div>

        {/* Team Performance */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Team Performance
          </h3>
          {/* Add team performance chart here */}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics; 