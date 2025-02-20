import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PlusIcon, 
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { ProjectService } from '../../services/ProjectService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { selectAllUsers, fetchUsers } from '../../store/slices/usersSlice';
import AddMemberModal from '../../components/projects/AddMemberModal';

const MembersPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  
  // Get users from Redux store
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(fetchUsers());
    fetchMembers();
  }, [projectId, dispatch]);

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

  const handleAddMember = async (selectedUserId, role) => {
    try {
      await ProjectService.addMember(projectId, selectedUserId, role);
      await fetchMembers();
      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
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

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  // Map members with user data
  const memberUsers = members.map(member => {
    // Convert userId to string for comparison
    const user = users.find(u => u.id.toString() === member.userId.toString());
    return {
      ...member,
      user: user || { name: 'Unknown User', email: 'No email' }
    };
  });

  const admins = memberUsers.filter(m => m.role === 'ADMIN');
  const regularMembers = memberUsers.filter(m => m.role === 'MEMBER');
  const viewers = memberUsers.filter(m => m.role === 'VIEWER');

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
        className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 
        text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
        focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
        dark:bg-indigo-500 dark:hover:bg-indigo-400 
        transition-colors duration-200" 
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
          {memberUsers.map((member) => (
            <li key={member.userId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar userId={member.userId} size="md" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.user?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Role Selector */}
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
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
                      onClick={() => window.location.href = `mailto:${member.user?.email}`}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
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

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAdd={handleAddMember}
        existingMembers={members.map(m => m.userId)}
        users={users}
      />
    </div>
  );
};

export default MembersPage; 