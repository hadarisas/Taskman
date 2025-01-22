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

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [teamsData, usersData] = await Promise.all([
        TeamService.getAllTeams(),
        UserService.getAllUsers(),
      ]);

      setTeams(teamsData);
      setAvailableUsers(
        usersData.map((user) => ({
          value: user.id,
          label: user.name,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to load teams and users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateTeam = async (formData) => {
    try {
      if (selectedTeam) {
        await TeamService.updateTeam(selectedTeam.id, formData);
        toast.success("Team updated successfully");
      } else {
        await TeamService.createTeam(formData);
        toast.success("Team created successfully");
      }
      setIsTeamModalOpen(false);
      setSelectedTeam(null);
      fetchData();
    } catch (error) {
      toast.error(
        selectedTeam ? "Failed to update team" : "Failed to create team"
      );
    }
  };

  const handleAddMembers = async (members) => {
    try {
      await TeamService.addMembers(selectedTeam.id, { members });
      toast.success("Team members added successfully");
      setIsMembersModalOpen(false);
      setSelectedTeam(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to add team members");
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

  const handleRemoveMember = async (teamId, userId) => {
    try {
      await TeamService.removeMember(teamId, userId);
      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(member => member.userId !== userId)
          };
        }
        return team;
      }));
      
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteTeam = (team) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await TeamService.deleteTeam(teamToDelete.id);
      toast.success("Team deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete team");
    } finally {
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };



  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} onRetry={fetchData} />;
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
          onSubmit={handleCreateOrUpdateTeam}
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
          onConfirm={confirmDelete}
          title="Delete Team"
          message={`Are you sure you want to delete the team "${teamToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Teams;
