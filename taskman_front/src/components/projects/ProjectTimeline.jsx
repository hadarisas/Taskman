import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CalendarIcon, 
  FlagIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { ProjectService } from '../../services/ProjectService';
import { TaskService } from '../../services/TaskService';

const ProjectTimeline = () => {
  const { projectId } = useParams();
  const [timelineData, setTimelineData] = useState({
    milestones: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, [projectId]);

  const fetchTimelineData = async () => {
    try {
      const [milestones, tasks] = await Promise.all([
        ProjectService.getProjectMilestones(projectId),
        TaskService.getAllTasks(projectId)
      ]);
      
      setTimelineData({ milestones, tasks });
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Timeline
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track project progress and milestones
            </p>
          </div>
        </div>

        {/* Timeline View */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          {timelineData.milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative pl-10 pb-8">
              <div className="absolute left-2 -ml-px h-4 w-4 rounded-full bg-indigo-500" />
              <div className="flex items-center space-x-2 mb-1">
                <FlagIcon className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {milestone.title}
                </h3>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                <time dateTime={milestone.dueDate}>
                  {new Date(milestone.dueDate).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Task Timeline */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          {timelineData.tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-4">
              <CheckCircleIcon className={`h-5 w-5 ${
                task.status === 'DONE' 
                  ? 'text-green-500' 
                  : 'text-gray-400'
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.status}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(task.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline; 