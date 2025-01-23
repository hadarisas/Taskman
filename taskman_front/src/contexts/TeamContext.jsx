import React, { createContext, useContext, useState, useCallback } from 'react';
import { TeamService } from '../services/TeamService';
import { UserService } from '../services/UserService';

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await TeamService.getAllTeams();
      setTeams(teamsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectTeam = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const [projectTeams, projectMembers] = await Promise.all([
        TeamService.getProjectTeams(projectId),
        TeamService.getProjectMembers(projectId)
      ]);
      setTeams(projectTeams);
      setMembers(projectMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TeamContext.Provider value={{
      teams,
      members,
      loading,
      error,
      fetchTeams,
      fetchProjectTeam,
      setTeams,
      setMembers
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}; 