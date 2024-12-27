import api from '../utils/axios';

export const TeamService = {
  // Get all teams
  async getAllTeams() {
    const response = await api.get('/teams');
    return response.data;
  },

  // Get single team
  async getTeam(teamId) {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  // Get team members
  async getTeamMembers(teamId) {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  },

  // Get team leaders
  async getTeamLeaders(teamId) {
    const response = await api.get(`/teams/${teamId}/leaders`);
    return response.data;
  },

  // Create new team
  async createTeam(teamData) {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Update team
  async updateTeam(teamId, teamData) {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  },

  // Delete team
  async deleteTeam(teamId) {
    await api.delete(`/teams/${teamId}`);
  },

  // Add member to team
  async addTeamMember(teamId, memberData) {
    const response = await api.post(`/teams/${teamId}/members`, memberData);
    return response.data;
  },

  // Update member role
  async updateMemberRole(teamId, memberId, role) {
    const response = await api.put(`/teams/${teamId}/members/${memberId}/role`, { role });
    return response.data;
  },

  // Remove member from team
  async removeTeamMember(teamId, memberId) {
    await api.delete(`/teams/${teamId}/members/${memberId}`);
  }
};

export default TeamService; 