import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import { TeamService } from "../../services/TeamService";
import AddMemberModal from "./AddMemberModal";
import EditTeamModal from "./EditTeamModal";
import ConfirmDialog from "../ConfirmDialog";
import Avatar from "../Avatar";
import { useAuth } from "../../contexts/AuthContext";

const TeamCard = ({ team, onUpdate }) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const { user: currentUser } = useAuth();

  const isSystemAdmin = currentUser.role === "ADMIN";

  const currentMember = team.members.find(
    (member) => member.userId === currentUser.id
  );
  const isTeamAdmin = currentMember?.role === "ADMIN";
  const isTeamManager = currentMember?.role === "MANAGER";

  const canManageMembers = isSystemAdmin || isTeamAdmin || isTeamManager;
  const canEditTeam = isSystemAdmin || isTeamAdmin;

  const handleAddMember = async (memberData) => {
    try {
      await TeamService.addTeamMember(team.id, memberData);
      onUpdate();
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await TeamService.deleteTeam(team.id);
      onUpdate();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !memberToRemove.userId) {
      console.error("No valid user ID found");
      return;
    }

    if (isTeamManager && memberToRemove.role === "ADMIN") {
      console.error("Managers cannot remove admins");
      return;
    }

    try {
      await TeamService.removeTeamMember(team.id, memberToRemove.userId);
      onUpdate();
      setMemberToRemove(null);
    } catch (error) {
      console.error("Error removing team member:", error);
    }
  };

  const canRemoveMember = (member) => {
    if (isTeamAdmin) {
      return member.userId !== currentUser.id;
    }
    if (isTeamManager) {
      return member.role !== "ADMIN" && member.userId !== currentUser.id;
    }
    return false;
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                    dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <Link
                to={`/teams/${team.id}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {team.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {team.members.length} members
            </p>
          </div>
          {canManageMembers && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Add member"
              >
                <UserPlusIcon className="h-5 w-5" />
              </button>
              {canEditTeam && (
                <>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    title="Edit team"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Delete team"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 5).map((member, index) => (
              <div
                key={`avatar-${member.id || member.userId || index}`}
                className="relative"
                title={member.userName}
              >
                <Avatar
                  user={{ name: member.userName }}
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-800"
                />
                {member.role === "ADMIN" && (
                  <span className="absolute -bottom-1 -right-1 block h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-white dark:ring-gray-800" />
                )}
              </div>
            ))}
            {team.members.length > 5 && (
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full 
                            bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 
                            dark:text-gray-400 ring-2 ring-white dark:ring-gray-800"
              >
                +{team.members.length - 5}
              </div>
            )}
          </div>
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md 
                                bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 
                                focus:outline-none divide-y divide-gray-100 dark:divide-gray-700"
            >
              <div className="px-2 py-2 max-h-64 overflow-y-auto">
                {team.members.map((member, index) => (
                  <Menu.Item key={`member-${member.userId || index}`}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? "bg-gray-50 dark:bg-gray-700" : ""
                        } flex items-center justify-between py-2 px-2 rounded-md`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar user={{ name: member.userName }} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.userName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        {(isSystemAdmin ||
                          (canManageMembers && canRemoveMember(member))) && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMemberToRemove(member);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Remove member"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
        teamId={team.id}
        isAdmin={isTeamAdmin}
      />

      <EditTeamModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={onUpdate}
        team={team}
      />

      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Remove Team Member"
        message={
          isTeamManager && memberToRemove?.role === "ADMIN"
            ? "You don't have permission to remove an admin member."
            : `Are you sure you want to remove ${memberToRemove?.userName} from the team?`
        }
        confirmText="Remove"
        confirmStyle="danger"
        disabled={isTeamManager && memberToRemove?.role === "ADMIN"}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTeam}
        title="Delete Team"
        message={`Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};

export default TeamCard;
