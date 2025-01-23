import React from "react";
import { 
  CalendarIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";

const ProjectCard = ({ project, viewType = 'grid' }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Calculate progress percentage
  const progressPercentage = project.totalTasks 
    ? Math.round((project.completedTasks / project.totalTasks) * 100) 
    : 0;

  // Calculate days remaining
  const daysRemaining = () => {
    const end = new Date(project.endDate);
    const today = new Date();
    const diff = end - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  if (viewType === 'list') {
    return (
      <div
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                  dark:border-gray-700 hover:shadow-md transition-shadow duration-200 
                  cursor-pointer p-4"
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Project Info - 4 columns */}
          <div className="col-span-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {project.description}
            </p>
          </div>

          {/* Status - 2 columns */}
          <div className="col-span-2 flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Progress - 2 columns */}
          <div className="col-span-2 flex items-center justify-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {progressPercentage}%
            </span>
          </div>

          {/* Tasks - 2 columns */}
          <div className="col-span-2 flex items-center justify-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {project.completedTasks}/{project.totalTasks}
            </span>
          </div>

          {/* Team Members - 2 columns */}
          <div className="col-span-2 flex justify-end">
            <div className="flex -space-x-2">
              {project.memberships?.slice(0, 3).map((membership) => (
                <Avatar
                  key={membership.id}
                  userId={membership.userId}
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-800"
                />
              ))}
              {project.memberships?.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full 
                              bg-gray-100 dark:bg-gray-700 text-xs font-medium 
                              text-gray-500 dark:text-gray-400 ring-2 ring-white 
                              dark:ring-gray-800">
                  +{project.memberships.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                dark:border-gray-700 hover:shadow-md transition-shadow duration-200 
                cursor-pointer group h-full flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-grow" />

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-5 w-5 mr-1.5" />
            <span>{daysRemaining()} days left</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CheckCircleIcon className="h-5 w-5 mr-1.5" />
            <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon className="h-5 w-5 mr-1.5" />
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>

          {project.memberships && project.memberships.length > 0 && (
            <div className="flex -space-x-2">
              {project.memberships.slice(0, 3).map((membership) => (
                <Avatar
                  key={membership.id}
                  userId={membership.userId}
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-800"
                />
              ))}
              {project.memberships.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full 
                              bg-gray-100 dark:bg-gray-700 text-xs font-medium 
                              text-gray-500 dark:text-gray-400 ring-2 ring-white 
                              dark:ring-gray-800">
                  +{project.memberships.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
