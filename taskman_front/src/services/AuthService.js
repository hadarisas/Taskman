import api from '../utils/axios';
import { toast } from 'react-toastify';

export const AuthService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user, message } = response.data;
      
      if (!access_token || !user) {
        toast.error('Invalid response from server');
        return { success: false };
      }

      return {
        success: true,
        data: {
          token: access_token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active
          }
        }
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage?.includes('Account is not active')) {
        toast.error('Account is not active. Please contact administrator.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.error('Invalid email or password', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }

      return { 
        success: false,
        error: errorMessage || 'Authentication failed'
      };
    }
  },

  // Add other auth-related methods here
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user data'
      };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      toast.error('Error logging out');
      return { success: false };
    }
  }
};

export default AuthService; 