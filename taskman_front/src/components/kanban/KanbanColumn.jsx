import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CalendarIcon, ChatBubbleLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";

const KanbanColumn = ({ tasks, isDragging, isDropping, onTaskClick }) => {
  const TaskCard = ({ task, provided, snapshot }) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`group p-4 bg-white dark:bg-gray-800/90 rounded-lg 
                  border border-gray-100 dark:border-gray-700/50 
                  ${snapshot.isDragging 
                    ? 'shadow-lg ring-2 ring-indigo-400 dark:ring-indigo-500' 
                    : 'shadow-sm hover:shadow-md'
                  }
                  transition-all duration-200 cursor-pointer
                  backdrop-blur-sm`}
    >
      {/* Priority Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {task.priority && (
            <span className={getPriorityBadgeClasses(task.priority)}>
              {task.priority.toLowerCase()}
            </span>
          )}
          {task.labels?.map(label => (
            <span key={label} className="px-2 py-1 rounded-full text-xs bg-gray-100 
                                       dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              {label}
            </span>
          ))}
        </div>
        
        {/* Quick Actions (visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <PencilIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {formatDueDate(task.dueDate)}
            </div>
          )}
          {task.comments > 0 && (
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-3.5 w-3.5 mr-1" />
              {task.comments}
            </div>
          )}
        </div>

        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees?.map(assignee => (
            <Avatar key={assignee} userId={assignee} size="xs" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
          {(provided, snapshot) => (
            <TaskCard task={task} provided={provided} snapshot={snapshot} />
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default KanbanColumn;
