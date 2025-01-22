import React, { useState } from "react";
import {
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TeamMembersListModal from './TeamMembersListModal';

const TeamCard = ({ team, onEdit, onDelete, onManageMembers, onRemoveMember }) => {
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const removeMember = (teamId, userId) => {
    onRemoveMember(teamId, userId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{team.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onManageMembers(team)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Add members"
          >
            <UserGroupIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(team)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Edit team"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(team)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Delete team"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {team.members && team.members.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2 overflow-hidden">
              {team.members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                >
                  <div className="w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                                flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {member.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              {team.members.length > 5 && (
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 
                              bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    +{team.members.length - 5}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsListModalOpen(true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 
                       hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              View all
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No members yet
          </p>
        )}
      </div>

      {team.members && team.members.length > 0 && (
        <TeamMembersListModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          members={team.members}
          team={team}
          onRemoveMember={(teamId, userId) => removeMember(teamId, userId)}
        />
      )}
    </div>
  );
};

export default TeamCard;
