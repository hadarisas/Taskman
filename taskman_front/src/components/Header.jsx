import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import Avatar from './Avatar';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 hover:opacity-80">
                <Avatar 
                  user={user} 
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-800" 
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}
                </span>
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 
                                  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
                                  focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate('/profile')}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700 
                         dark:text-gray-200`}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate('/settings')}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700 
                         dark:text-gray-200`}
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5" />
                      Settings
                    </button>
                  )}
                </Menu.Item>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-red-600 
                         dark:text-red-400`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 