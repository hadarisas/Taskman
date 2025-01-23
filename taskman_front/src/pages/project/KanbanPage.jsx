import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { TaskService } from '../../services/TaskService';

const KanbanPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    // Handle task click - open modal, etc.
    console.log('Task clicked:', task);
  };

  const handleAddTask = (status) => {
    // Handle adding new task
    console.log('Add task in status:', status);
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
    </div>
  );
};

export default KanbanPage; 