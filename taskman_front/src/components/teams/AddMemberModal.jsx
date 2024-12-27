import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { UserService } from '../../services/UserService';
import LoadingSpinner from '../LoadingSpinner';
import Avatar from '../Avatar';

const ROLES = [
  { id: 'ADMIN', label: 'Administrator', description: 'Full access to manage team and members' },
  { id: 'MEMBER', label: 'Member', description: 'Can participate in team activities' },
  { id: 'VIEWER', label: 'Viewer', description: 'Can only view team content' }
];

const AddMemberModal = ({ isOpen, onClose, onAdd, teamId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
      setSelectedUserId('');
      setSelectedRole('MEMBER');
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd({
        userId: parseInt(selectedUserId),
        role: selectedRole
      });
      onClose();
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Team Member
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
                       transition-colors duration-150"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-6">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Users
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                             dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                {/* User Selection */}
                <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 
                              dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 
                                dark:hover:bg-gray-700/50 transition-colors duration-150
                                ${selectedUserId === user.id.toString() ? 
                                'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                    >
                      <input
                        type="radio"
                        name="user"
                        value={user.id}
                        checked={selectedUserId === user.id.toString()}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 
                                 border-gray-300 dark:border-gray-600"
                      />
                      <div className="ml-3 flex items-center space-x-3">
                        <Avatar user={user} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Role
                  </label>
                  <div className="grid gap-3">
                    {ROLES.map((role) => (
                      <label
                        key={role.id}
                        className={`relative flex items-start p-3 cursor-pointer rounded-lg 
                                  border ${selectedRole === role.id ?
                                  'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' :
                                  'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={selectedRole === role.id}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 
                                   border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {role.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {role.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border 
                           border-gray-300 dark:border-gray-600 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUserId}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                           hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddMemberModal; 