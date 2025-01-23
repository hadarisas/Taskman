import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { TeamService } from '../../services/TeamService';

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TeamService.getAllTeams();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState: {
    teams: {},
    isLoading: false,
    error: null
  },
  reducers: {
    // Handle user updates
    updateTeamMember: (state, action) => {
      const { teamId, userId, userData } = action.payload;
      if (state.teams[teamId]?.members) {
        state.teams[teamId].members = state.teams[teamId].members.map(member => 
          member.userId === userId ? { ...member, user: { ...member.user, ...userData } } : member
        );
      }
    },
    // Handle user deletion
    removeTeamMember: (state, action) => {
      const { teamId, userId } = action.payload;
      if (state.teams[teamId]?.members) {
        state.teams[teamId].members = state.teams[teamId].members.filter(
          member => member.userId !== userId
        );
      }
    },
    addTeam: (state, action) => {
      state.teams[action.payload.id] = action.payload;
    },
    updateTeam: (state, action) => {
      state.teams[action.payload.id] = {
        ...state.teams[action.payload.id],
        ...action.payload
      };
    },
    removeTeam: (state, action) => {
      delete state.teams[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload.reduce((acc, team) => {
          acc[team.id] = team;
          return acc;
        }, {});
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
const selectTeamsState = state => state.teams?.teams || {};

export const selectAllTeams = createSelector(
  [selectTeamsState],
  teams => Object.values(teams)
);

export const selectTeamById = createSelector(
  [selectTeamsState, (state, teamId) => teamId],
  (teams, teamId) => teams[teamId]
);

export const { 
  addTeam, 
  updateTeam, 
  removeTeam, 
  updateTeamMember, 
  removeTeamMember 
} = teamsSlice.actions;

export default teamsSlice.reducer; 