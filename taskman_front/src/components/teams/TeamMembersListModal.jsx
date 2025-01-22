import { Dialog } from "@headlessui/react";
import { XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const TeamMembersListModal = ({ isOpen, onClose, members, team, onRemoveMember }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="relative w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {team.name} - Team Members
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300
                               transition-colors duration-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div
                    className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 space-y-4 
                              scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                              scrollbar-track-transparent"
                  >
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg 
                                 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 
                                 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div
                              className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                                          flex items-center justify-center"
                            >
                              <span className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                                {member.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.userName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {member.role.charAt(0).toUpperCase() +
                                member.role.slice(1).toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveMember(team.id, member.userId)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400
                                   transition-colors duration-200 p-1 rounded-full
                                   hover:bg-red-50 dark:hover:bg-red-900/20
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove member"
                        >
                            <XMarkIcon className="h-5 w-5" /> 
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                               bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                               rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 
                               dark:focus:ring-indigo-400 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TeamMembersListModal;
