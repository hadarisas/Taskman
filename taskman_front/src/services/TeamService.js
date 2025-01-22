import api from "../utils/axios";

export const TeamService = {
  // Get all teams
  async getAllTeams() {
    const response = await api.get("/teams");
    return response.data;
  },

  // Get single team
  async getTeamById(teamId) {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  // Create new team
  async createTeam(teamData) {
    const response = await api.post("/teams", teamData);
    return response.data;
  },

  // Update team
  async updateTeam(teamId, teamData) {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  },

  // Delete team
  async deleteTeam(teamId) {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  },

  async addMembers(teamId, data) {
    const response = await api.post(`/teams/${teamId}/members`, data);
    return response.data;
  },

  async removeMember(teamId, userId) {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    console.log(`api: /teams/${teamId}/members/${userId}`);
    return response.data;
  },
};

export default TeamService;
