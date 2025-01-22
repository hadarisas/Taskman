import api from "../utils/axios";

export const UserService = {
  async getAllUsers() {
    const response = await api.get("/users");
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post("/users", userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export default UserService;
