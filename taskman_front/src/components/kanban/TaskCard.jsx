import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { createPortal } from 'react-dom';

const priorityColors = {
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  MEDIUM: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300",
};

export const TaskCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : undefined,
    zIndex: isDragging ? 9999 : 'auto',
    position: isDragging ? 'fixed' : undefined,
    width: isDragging ? 'var(--dragging-width)' : undefined,
    height: isDragging ? 'var(--dragging-height)' : undefined,
    pointerEvents: isDragging ? 'none' : undefined,
  };

  const handleClick = (e) => {
    if (!isDragging) {
      e.stopPropagation();
      onClick();
    }
  };

  const card = (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`
        bg-white dark:bg-gray-700 p-3 rounded-lg 
        border border-gray-200 dark:border-gray-600 
        cursor-pointer transition-all duration-200
        touch-none select-none
        ${isDragging 
          ? 'shadow-xl ring-2 ring-indigo-400 dark:ring-indigo-500 opacity-90'
          : 'shadow-sm hover:shadow-md'
        }
      `}
    >
      {/* Task Title */}
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
        {task.title}
      </h3>

      {/* Task Details */}
      <div className="space-y-2">
        {/* Priority Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Due Date & Assignee */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <UserCircleIcon className="h-4 w-4" />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isDragging) {
    const portalContainer = document.getElementById('portal-container');
    if (portalContainer) {
      return createPortal(card, portalContainer);
    }
  }

  return card;
};
