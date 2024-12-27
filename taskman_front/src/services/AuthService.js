import api from '../utils/axios';

export const AuthService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user, message } = response.data;
      
      // Log the response to debug
      console.log('Login response:', response.data);
      
      if (!access_token || !user) {
        throw new Error('Invalid response format');
      }

      return {
        token: access_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active
        }
      };
    } catch (error) {
      console.error('AuthService error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  }
};

export default AuthService; 