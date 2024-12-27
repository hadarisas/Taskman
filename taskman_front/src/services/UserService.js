import api from '../utils/axios';

export const UserService = {
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};

export default UserService; 