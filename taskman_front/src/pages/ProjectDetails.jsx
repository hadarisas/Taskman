import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  UserGroupIcon,
  CalendarIcon,
  Cog6ToothIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import PageHeader from "../components/common/PageHeader";
import { ProjectService } from "../services/ProjectService";
import ProjectModal from "../components/projects/ProjectModal";
import TeamManagementModal from "../components/projects/TeamManagementModal";
import ProjectSettingsModal from "../components/projects/ProjectSettingsModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { Outlet } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Get current tab from URL or default to 'kanban'
  const currentTab = location.pathname.split("/").pop();
  const activeTab = ["kanban", "members", "timeline"].includes(currentTab)
    ? currentTab
    : "kanban";

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const projectData = await ProjectService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectUpdate = async (projectData) => {
    try {
      await ProjectService.updateProject(projectId, projectData);
      await fetchProject();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleCancelProject = async () => {
    try {
      await ProjectService.updateProject(projectId, { ...project, status: 'CANCELLED' });
      await fetchProject();
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling project:", error);
    }
  };

  const handleTabChange = (tab) => {
    navigate(`/projects/${projectId}/${tab}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.NOT_STARTED;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const headerActions = (
    <div className="flex items-center space-x-2">
      {project?.status !== 'CANCELLED' && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="btn-icon text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Cancel Project"
        >
          <NoSymbolIcon className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={() => setShowEditModal(true)}
        className="btn-icon"
        title="Edit Project"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title={project?.name} description={project?.description}>
          {headerActions}
        </PageHeader>

        {/* Project Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Add your stat cards here */}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-4 p-4">
            <TabButton
              active={activeTab === "kanban"}
              onClick={() => handleTabChange("kanban")}
              icon={<Squares2X2Icon className="h-5 w-5" />}
              label="Kanban"
            />
            <TabButton
              active={activeTab === "members"}
              onClick={() => handleTabChange("members")}
              icon={<UserGroupIcon className="h-5 w-5" />}
              label="Members"
            />
            <TabButton
              active={activeTab === "timeline"}
              onClick={() => handleTabChange("timeline")}
              icon={<CalendarIcon className="h-5 w-5" />}
              label="Timeline"
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleProjectUpdate}
        project={project}
      />
      <TeamManagementModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        projectId={projectId}
        currentMembers={project?.members || []}
      />
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={project}
        onSubmit={handleProjectUpdate}
      />
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelProject}
        title="Cancel Project"
        message={`Are you sure you want to cancel the project "${project?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center px-3 py-2 rounded-md text-sm font-medium
      ${
        active
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }
    `}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

export default ProjectDetails;
