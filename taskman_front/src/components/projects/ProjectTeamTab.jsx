import React, { useState, useEffect } from "react";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { TeamService } from "../../services/TeamService";
import { UserService } from "../../services/UserService";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import TeamMembersModal from "../teams/TeamMembersModal";

const ProjectTeamTab = ({ projectId }) => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectTeamData();
  }, [projectId]);

  const fetchProjectTeamData = async () => {
    try {
      const [projectTeams, projectMembers, users] = await Promise.all([
        TeamService.getProjectTeams(projectId),
        TeamService.getProjectMembers(projectId),
        UserService.getAllUsers()
      ]);

      setTeams(projectTeams);
      setMembers(projectMembers);
      setAvailableUsers(users.map(user => ({
        value: user.id,
        label: user.name
      })));
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleAddMembers = async (selectedMembers) => {
    try {
      await TeamService.addProjectMembers(projectId, selectedMembers);
      await fetchProjectTeamData();
      setIsAddMembersModalOpen(false);
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Team
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage team members and their roles in this project
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddMembersModalOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Members
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <UserGroupIcon className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Members
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {members.length}
              </p>
            </div>
          </div>
          {/* Add more stats as needed */}
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 
                       dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar userId={member.userId} size="md" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className="text-sm rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700"
                >
                  <option value="MEMBER">Member</option>
                  <option value="LEAD">Team Lead</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Associated Teams */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Associated Teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {team.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {team.members.length} members
              </p>
            </div>
          ))}
        </div>
      </div>

      <TeamMembersModal
        isOpen={isAddMembersModalOpen}
        onClose={() => setIsAddMembersModalOpen(false)}
        onSubmit={handleAddMembers}
        availableUsers={availableUsers}
      />
    </div>
  );
};

export default ProjectTeamTab; 