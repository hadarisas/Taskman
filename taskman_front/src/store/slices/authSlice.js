import { createSlice } from '@reduxjs/toolkit';

// Initialize state with user data from localStorage if available
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

const initialState = {
  currentUser: userData ? JSON.parse(userData) : null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  }
});

// Actions
export const { setCurrentUser, setLoading, setError, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Async thunks
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const user = await response.json();
    dispatch(setCurrentUser(user));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch('/api/auth/me');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    dispatch(setCurrentUser(user));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    dispatch(logout());
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default authSlice.reducer; 