import api from '../utils/axios';

export const TaskService = {
  async getAllTasks(projectId) {
    //http://localhost:8080/api/tasks?projectId=8
    const response = await api.get(`/tasks?projectId=${projectId}`);
    return response.data;
  },

  async getTaskById(taskId) {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(taskId, taskData) {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  async updateTaskStatus(taskId, status) {
    const response = await api.put(`/tasks/${taskId}`, { status });
    return response.data;
  },

  async deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

export default TaskService; 