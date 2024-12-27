import React, { Fragment } from 'react';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Avatar from './Avatar.jsx';

const UserMenu = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="flex items-center gap-x-2 rounded-full bg-white dark:bg-gray-800 
                           text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                           focus:ring-offset-2 hover:bg-gray-50 dark:hover:bg-gray-700 
                           p-1 pr-2 transition-colors duration-200">
        <span className="sr-only">Open user menu</span>
        <Avatar user={user} size="sm" />
        <span className="hidden sm:flex items-center text-gray-700 dark:text-gray-300">
          <span className="text-sm font-medium">{user.name}</span>
          <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y 
                          divide-gray-100 dark:divide-gray-700 rounded-md bg-white 
                          dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 
                          focus:outline-none">
        <div className="px-4 py-3">
          <p className="text-sm text-gray-900 dark:text-white font-semibold">
            {user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 
                         px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
              {user.role}
            </span>
          </div>
        </div>

        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                href="/profile"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
              >
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="/settings"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
              >
                Settings
              </a>
            )}
          </Menu.Item>
        </div>

        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center px-4 py-2 text-sm text-red-700 dark:text-red-400`}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default UserMenu; 