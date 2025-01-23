import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TeamService } from "../services/TeamService";
import { UserService } from "../services/UserService";
import TeamCard from "../components/teams/TeamCard";
import TeamModal from "../components/teams/TeamModal";
import TeamMembersModal from "../components/teams/TeamMembersModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import PageHeader from "../components/common/PageHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorPage from "../components/common/ErrorPage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams, selectAllTeams } from '../store/slices/teamsSlice';
import { selectAllUsers } from '../store/slices/usersSlice';

const Teams = () => {
  const dispatch = useDispatch();
  const teams = useSelector(selectAllTeams);
  const users = useSelector(selectAllUsers);
  const isLoading = useSelector(state => state.teams.isLoading);
  const error = useSelector(state => state.teams.error);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    try {
      if (selectedTeam) {
        const updatedTeam = await TeamService.updateTeam(selectedTeam.id, formData);
        dispatch(updateTeam(updatedTeam));
        toast.success("Team updated successfully");
      } else {
        const newTeam = await TeamService.createTeam(formData);
        dispatch(addTeam(newTeam));
        toast.success("Team created successfully");
      }
      setIsTeamModalOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error submitting team:", error);
      toast.error(selectedTeam ? "Failed to update team" : "Failed to create team");
    }
  };

  const handleAddMembers = async (teamId, newMembers) => {
    try {
      const updatedTeam = await TeamService.addMembers(teamId, newMembers);
      dispatch(updateTeam(updatedTeam));
      toast.success("Members added successfully");
    } catch (error) {
      toast.error("Failed to add members");
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    try {
      await TeamService.removeMember(teamId, userId);
      dispatch(removeTeamMember({ teamId, userId }));
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await TeamService.deleteTeam(teamId);
      dispatch(removeTeam(teamId));
      toast.success("Team deleted successfully");
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleManageMembers = (team) => {
    setSelectedTeam(team);
    setIsMembersModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} onRetry={() => dispatch(fetchTeams())} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Teams"
          description="A list of all teams in your organization including their members and projects."
        >
          <button
            onClick={() => {
              setSelectedTeam(null);
              setIsTeamModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md 
                     bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
                     shadow-sm hover:bg-indigo-500 focus-visible:outline 
                     focus-visible:outline-2 focus-visible:outline-offset-2 
                     focus-visible:outline-indigo-600 dark:bg-indigo-500 
                     dark:hover:bg-indigo-400 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add team
          </button>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
              onManageMembers={handleManageMembers}
              onRemoveMember={(teamId, userId) => handleRemoveMember(teamId, userId)}
            />
          ))}
        </div>

        <TeamModal
          isOpen={isTeamModalOpen}
          onClose={() => {
            setIsTeamModalOpen(false);
            setSelectedTeam(null);
          }}
          onSubmit={handleSubmit}
          team={selectedTeam}
        />

        <TeamMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => {
            setIsMembersModalOpen(false);
            setSelectedTeam(null);
          }}
          onSubmit={handleAddMembers}
          team={selectedTeam}
          availableUsers={availableUsers}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setTeamToDelete(null);
          }}
          onConfirm={() => handleDeleteTeam(teamToDelete.id)}
          title="Delete Team"
          message={`Are you sure you want to delete the team "${teamToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Teams;
