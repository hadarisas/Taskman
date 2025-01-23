import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import KanbanBoard from "../components/kanban/KanbanBoard";
import { TaskService } from "../services/TaskService";
import { ProjectService } from "../services/ProjectService";
import PageHeader from "../components/common/PageHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import TaskModal from "../components/tasks/TaskModal";
import ProjectModal from "../components/projects/ProjectModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

const KanbanPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        ProjectService.getProjectById(projectId),
        TaskService.getAllTasks(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      await fetchProjectAndTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskClick = async (task) => {
    try {
      // Fetch full task details if needed
      const taskDetails = await TaskService.getTaskById(task.id);
      setSelectedTask({
        ...taskDetails,
        dueDate: taskDetails.dueDate ? taskDetails.dueDate.split("T")[0] : "",
      });
      setIsTaskModalOpen(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      await TaskService.createTask({
        ...taskData,
        projectId: parseInt(projectId, 10),
      });
      await fetchProjectAndTasks();
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskUpdate = async (taskData) => {
    try {
      await TaskService.updateTask(selectedTask.id, {
        ...taskData,
        projectId: parseInt(projectId, 10),
      });
      await fetchProjectAndTasks();
      setIsTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleProjectUpdate = async (projectData) => {
    try {
      await ProjectService.updateProject(projectId, projectData);
      await fetchProjectAndTasks();
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleProjectDelete = async () => {
    try {
      await ProjectService.deleteProject(projectId);
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col">
     

      <div className="flex-1 mt-6">
        <KanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
        />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleTaskUpdate : handleTaskCreate}
        task={selectedTask}
        projectId={projectId}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleProjectUpdate}
        project={project}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleProjectDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
};

export default KanbanPage;
