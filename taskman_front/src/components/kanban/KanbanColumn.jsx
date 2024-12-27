import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Avatar from '../Avatar';

const KanbanColumn = ({ tasks, isDragging, isDropping, onTaskClick }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Draggable 
          key={task.id} 
          draggableId={task.id.toString()} 
          index={index}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() => onTaskClick(task)}
              className={`p-4 bg-white dark:bg-gray-800/90 rounded-lg shadow-sm 
                        border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm
                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-400 dark:ring-indigo-500' : ''}
                        hover:shadow-md transition-all duration-200 cursor-pointer`}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {task.title}
              </h4>
              
              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  {task.dueDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {task.comments > 0 && (
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-3.5 w-3.5 mr-1" />
                      {task.comments}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {task.priority && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs
                      ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {task.priority.toLowerCase()}
                    </span>
                  )}
                  {task.assignee && (
                    <Avatar userId={task.assignee} size="xs" />
                  )}
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default KanbanColumn; 