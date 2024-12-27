import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Avatar from '../components/Avatar';
import { UserService } from '../services/UserService';
import UserModal from '../components/users/UserModal';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';

const roleColors = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  USER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  MANAGER: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800'
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Add new state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || 
                       user.role === roleFilter.toUpperCase();
                       
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && user.active === true) ||
                         (statusFilter === 'INACTIVE' && user.active === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter configurations
  const filters = [
    {
      name: 'role',
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { value: 'ALL', label: 'All Roles' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'USER', label: 'User' }
      ]
    },
    {
      name: 'status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'ALL', label: 'All Status' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' }
      ]
    }
  ];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await UserService.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await UserService.updateUser(selectedUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await UserService.createUser(formData);
        toast.success('User created successfully');
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <PageHeader
          title="Users"
          description="A list of all users in your organization including their name, email, role and status."
        >
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md 
                     bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
                     shadow-sm hover:bg-indigo-500 focus-visible:outline 
                     focus-visible:outline-2 focus-visible:outline-offset-2 
                     focus-visible:outline-indigo-600 dark:bg-indigo-500 
                     dark:hover:bg-indigo-400 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add user
          </button>
        </PageHeader>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          className="mb-6"
        />

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {currentItems.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <Avatar user={user} size="sm" />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 
                          ${user.active ? statusColors.active : statusColors.inactive}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 
                                   dark:hover:text-indigo-300 mr-4 transition-colors duration-200"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 
                                   dark:hover:text-red-300 transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {currentItems.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 space-y-4"
            >
              {/* User Header with Avatar and Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar user={user} size="md" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-1 text-indigo-600 hover:text-indigo-900 
                             dark:text-indigo-400 dark:hover:text-indigo-300 
                             transition-colors duration-200"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-1 text-red-600 hover:text-red-900 
                             dark:text-red-400 dark:hover:text-red-300 
                             transition-colors duration-200"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-1 text-xs font-semibold leading-5 ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-1 text-xs font-semibold leading-5 
                    ${user.active ? statusColors.active : statusColors.inactive}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Users; 