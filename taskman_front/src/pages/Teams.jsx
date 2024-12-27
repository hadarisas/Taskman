import React, { useState, useEffect } from 'react';
import { TeamService } from '../services/TeamService';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateTeamModal from '../components/teams/CreateTeamModal';
import TeamCard from '../components/teams/TeamCard';
import PageHeader from '../components/PageHeader';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await TeamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      await TeamService.createTeam(teamData);
      fetchTeams();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Teams"
          description="Manage your teams and their members"
        >
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white 
                       bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                       dark:focus:ring-offset-gray-900"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Team
            </button>
          )}
        </PageHeader>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No teams</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team}
                onUpdate={fetchTeams}
                isAdmin={user?.role === 'ADMIN'}
              />
            ))}
          </div>
        )}

        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTeam}
        />
      </div>
    </div>
  );
};

export default Teams; 