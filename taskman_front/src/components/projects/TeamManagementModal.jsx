import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTeam } from "../../contexts/TeamContext";

const TeamManagementModal = ({ isOpen, onClose, project, onSubmit }) => {
  const { team } = useTeam();
  const [selectedMembers, setSelectedMembers] = useState(project?.team || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedMembers);
    onClose();
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  if (!team || !team.members) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
            <div className="flex items-center justify-center">
              <p>Loading team members...</p>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">
              Manage Team Members
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {member.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TeamManagementModal; 