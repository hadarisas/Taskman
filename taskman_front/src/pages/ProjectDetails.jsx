import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { TaskService } from '../services/TaskService';
import { ProjectService } from '../services/ProjectService';
import TaskModal from '../components/tasks/TaskModal';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const data = await TaskService.getAllTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="h-full p-6">
      <div className="h-full">
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
        task={selectedTask}
        onUpdate={fetchTasks}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectDetails; 