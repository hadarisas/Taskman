import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  PlusIcon, 
  EnvelopeIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { ProjectService } from '../../services/ProjectService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';

const MembersPage = () => {
  const { projectId } = useParams();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const data = await ProjectService.getProjectMembers(projectId);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await ProjectService.removeMember(projectId, userId);
      await fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await ProjectService.updateMemberRole(projectId, userId, newRole);
      await fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Members</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage team members and their roles
          </p>
        </div>
        <Button
          onClick={() => setShowAddMemberModal(true)}
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
        >
          Add Member
        </Button>
      </div>

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((member) => (
            <li key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar userId={member.id} size="md" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Role Selector */}
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="text-sm rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.location.href = `mailto:${member.email}`}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-400 hover:text-red-500 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</h4>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</h4>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {members.filter(m => m.role === 'ADMIN').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active This Week</h4>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {members.filter(m => m.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembersPage; 