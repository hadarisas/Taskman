import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import { StrictModeDroppable } from './StrictModeDroppable';

const TASK_STATUS = {
  TODO: { 
    id: 'TODO', 
    label: 'To Do', 
    color: 'bg-gray-50 dark:bg-gray-800/50',
    borderColor: 'border-gray-200 dark:border-gray-700',
    icon: '📋'
  },
  IN_PROGRESS: { 
    id: 'IN_PROGRESS', 
    label: 'In Progress', 
    color: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '🔄'
  },
  REVIEW: { 
    id: 'REVIEW', 
    label: 'In Review', 
    color: 'bg-yellow-50 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    icon: '👀'
  },
  DONE: { 
    id: 'DONE', 
    label: 'Completed', 
    color: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: '✅'
  },
  CANCELLED: { 
    id: 'CANCELLED', 
    label: 'Cancelled', 
    color: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: '❌'
  }
};

const KanbanBoard = ({ tasks, onTaskMove, onTaskClick }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceStatus !== destinationStatus) {
      const task = tasks.find(t => t.id.toString() === taskId);
      if (task) {
        onTaskMove(task.id, destinationStatus);
      }
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {Object.values(TASK_STATUS).map((status) => (
          <div
            key={status.id}
            className="flex-1 min-w-[300px] max-w-[350px] md:min-w-[320px]"
          >
            <div className="flex flex-col h-full rounded-lg border bg-white dark:bg-gray-800 
                          shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{status.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {status.label}
                    </h3>
                  </div>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs 
                                font-medium rounded-full bg-gray-100 dark:bg-gray-700 
                                text-gray-600 dark:text-gray-400">
                    {getTasksByStatus(status.id).length}
                  </span>
                </div>
              </div>
              
              <StrictModeDroppable droppableId={status.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 overflow-y-auto min-h-[200px] max-h-[600px]
                              ${status.color} ${status.borderColor}`}
                  >
                    <KanbanColumn
                      tasks={getTasksByStatus(status.id)}
                      isDragging={isDragging}
                      isDropping={snapshot.isDraggingOver}
                      onTaskClick={onTaskClick}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard; 