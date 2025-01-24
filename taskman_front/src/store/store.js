import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import teamsReducer from './slices/teamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    teams: teamsReducer
  }
});

export default store; 