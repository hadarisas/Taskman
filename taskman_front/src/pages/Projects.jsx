import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
 
} from "@heroicons/react/24/outline";
import { ProjectService } from "../services/ProjectService";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectModal from "../components/projects/ProjectModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import PageHeader from "../components/common/PageHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorPage from "../components/common/ErrorPage";
import { toast } from "react-toastify";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ProjectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateOrUpdateProject = async (formData) => {
    try {
      if (selectedProject) {
        await ProjectService.updateProject(selectedProject.id, formData);
        toast.success("Project updated successfully");
      } else {
        await ProjectService.createProject(formData);
        toast.success("Project created successfully");
      }
      setIsProjectModalOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      toast.error(
        selectedProject
          ? "Failed to update project"
          : "Failed to create project"
      );
    }
  };

  const handleDeleteProject = async () => {
    try {
      await ProjectService.deleteProject(projectToDelete.id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Filter projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.startDate) - new Date(a.startDate);
        case "oldest":
          return new Date(a.startDate) - new Date(b.startDate);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} onRetry={fetchProjects} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Projects"
          description="A list of all projects in your organization including their status and team assignments."
        >
          <button
            onClick={() => {
              setSelectedProject(null);
              setIsProjectModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md 
                     bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
                     shadow-sm hover:bg-indigo-500 focus-visible:outline 
                     focus-visible:outline-2 focus-visible:outline-offset-2 
                     focus-visible:outline-indigo-600 dark:bg-indigo-500 
                     dark:hover:bg-indigo-400 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add project
          </button>
        </PageHeader>

        {/* Add Filter Bar */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-64 rounded-md border-gray-300 dark:border-gray-600 
                           shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                           dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 border-l pl-4 dark:border-gray-600">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded-md ${
                    viewType === "grid"
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50"
                      : "text-gray-400"
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded-md ${
                    viewType === "list"
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50"
                      : "text-gray-400"
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 
                         shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                         dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 
                         shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                         dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div
          className={`grid gap-6 ${
            viewType === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } mt-6`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewType={viewType}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new project"}
            </p>
          </div>
        )}

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
          }}
          onSubmit={handleCreateOrUpdateProject}
          project={selectedProject}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setProjectToDelete(null);
          }}
          onConfirm={handleDeleteProject}
          title="Delete Project"
          message={`Are you sure you want to delete ${projectToDelete?.name}? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Projects;
