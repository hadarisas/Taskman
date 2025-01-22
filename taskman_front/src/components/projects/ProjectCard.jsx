import React from "react";
import { CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";

const ProjectCard = ({ project }) => {
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
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleClick = () => {
    navigate(`/projects/${project.id}/kanban`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                dark:border-gray-700 hover:shadow-md transition-shadow duration-200 
                cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${getStatusColor(project.status)}`}
          >
            {project.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-5 w-5 mr-1.5" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UserGroupIcon className="h-5 w-5 mr-1.5" />
              <span>{project.memberships?.length || 0}</span>
            </div>
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
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full 
                              bg-gray-100 dark:bg-gray-700 text-xs font-medium 
                              text-gray-500 dark:text-gray-400 ring-2 ring-white 
                              dark:ring-gray-800"
                >
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
