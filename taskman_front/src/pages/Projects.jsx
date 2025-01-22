import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setSelectedProject(project);
                setIsProjectModalOpen(true);
              }}
              onDelete={() => {
                setProjectToDelete(project);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>

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
