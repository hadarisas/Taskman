import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import teamsReducer from './slices/teamsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    teams: teamsReducer
  }
}); 