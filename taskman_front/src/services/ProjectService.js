import api from "../utils/axios";

export const ProjectService = {
  getAllProjects: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/projects");
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error - Please check your login status");
      }
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  getProjectById: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  getProjectMembers: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project members:", error);
      throw error;
    }
  },

  addMember: async (projectId, userId, role) => {
    try {
      const response = await api.post(`/projects/${projectId}/members?targetUserId=${userId}&role=${role}`);
      return response.data;
    } catch (error) {
      console.error("Error adding project member:", error);
      throw error;
    }
  },

  removeMember: async (projectId, userId) => {
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
    } catch (error) {
      console.error("Error removing project member:", error);
      throw error;
    }
  },

  updateMemberRole: async (projectId, userId, role) => {
    try {
      const response = await api.put(`/projects/${projectId}/members/${userId}/role?role=${role}`); 
      return response.data;
    } catch (error) {
      console.error("Error updating project member role:", error);
      throw error;
    }
  }
};

export default ProjectService;
