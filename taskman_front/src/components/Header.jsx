import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = user?.role === 'ADMIN';

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'Teams', href: '/teams' },
    { name: 'Tasks', href: '/tasks' }
  ];

  const navigation = isLoading 
    ? baseNavigation
    : [
        ...baseNavigation,
        ...(isAdmin ? [{ name: 'Users', href: '/users' }] : [])
      ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Left side with logo and hamburger */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="lg:hidden -ml-2 mr-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md 
                         text-gray-400 hover:text-gray-500 hover:bg-gray-100 
                         dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
                         focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Taskman"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                           ${isActive(item.href)
                      ? 'border-b-2 border-indigo-500 text-gray-900 dark:text-white'
                      : 'border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        {/* Mobile menu  */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 pl-3 pr-4 text-base font-medium 
                         ${isActive(item.href)
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'border-l-4 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                  } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 