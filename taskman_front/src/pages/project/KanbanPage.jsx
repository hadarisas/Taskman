import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { TaskService } from '../../services/TaskService';
import TaskModal from '../../components/tasks/TaskModal';
import { toast } from 'react-toastify';

const KanbanPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await TaskService.getAllTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (status) => {
    // Create a new empty task with just the status and projectId
    setSelectedTask({ 
      status, 
      projectId,
      id: null, // Explicitly set id to null for new tasks
      title: '',
      description: '',
      priority: 'MEDIUM',
      startDate: '',
      dueDate: '',
      assigneeId: ''
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (!selectedTask.id) {
        await TaskService.createTask({ ...taskData, projectId });
        toast.success('Task created successfully');
      } else {
        await TaskService.updateTask(selectedTask.id, taskData);
        toast.success('Task updated successfully');
      }
      await fetchTasks();
      handleModalClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(!selectedTask.id ? 'Failed to create task' : 'Failed to update task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <KanbanBoard
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
      />
    </div>
  );
};

export default KanbanPage; 