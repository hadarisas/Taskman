import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { UserService } from '../../services/UserService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getAllUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: {},
    isLoading: false,
    error: null
  },
  reducers: {
    addUser: (state, action) => {
      state.users[action.payload.id] = action.payload;
    },
    updateUser: (state, action) => {
      state.users[action.payload.id] = {
        ...state.users[action.payload.id],
        ...action.payload
      };
    },
    removeUser: (state, action) => {
      delete state.users[action.payload];
    },
    clearUsers: (state) => {
      state.users = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert array to object with ids as keys
        state.users = action.payload.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { addUser, updateUser, removeUser, clearUsers } = usersSlice.actions;

// Memoized selectors
const selectUsersState = state => state.users.users;

export const selectAllUsers = createSelector(
  [selectUsersState],
  users => Object.values(users)
);

export const selectUserById = createSelector(
  [selectUsersState, (state, userId) => userId],
  (users, userId) => users[userId]
);

export const selectUsersByIds = createSelector(
  [selectUsersState, (state, userIds) => userIds],
  (users, userIds) => userIds.map(id => users[id]).filter(Boolean)
);

export const selectUsersLoading = state => state.users.isLoading;
export const selectUsersError = state => state.users.error;

export default usersSlice.reducer; 