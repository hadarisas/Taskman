import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { TaskCard } from './TaskCard';
import { PlusIcon } from "@heroicons/react/24/outline";

const COLUMNS = {
  TODO: {
    id: "TODO",
    label: "To Do",
    color: "bg-gray-50 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-700",
    headerColor: "text-gray-700 dark:text-gray-200",
    icon: "📋",
  },
  IN_PROGRESS: {
    id: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-blue-50 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    headerColor: "text-blue-700 dark:text-blue-200",
    icon: "🔄",
  },
  REVIEW: {
    id: "REVIEW",
    label: "In Review",
    color: "bg-yellow-50 dark:bg-yellow-900/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    headerColor: "text-yellow-700 dark:text-yellow-200",
    icon: "👀",
  },
  DONE: {
    id: "DONE",
    label: "Completed",
    color: "bg-green-50 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    headerColor: "text-green-700 dark:text-green-200",
    icon: "✅",
  }
};

const KanbanBoard = ({ tasks = [], onTaskMove, onTaskClick, onAddTask }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onTaskMove?.(active.id, over.id);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {Object.values(COLUMNS).map((column) => (
          <div
            key={column.id}
            className={`rounded-lg ${column.color} border ${column.borderColor} backdrop-blur-sm`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-inherit">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{column.icon}</span>
                  <h3 className={`font-medium ${column.headerColor}`}>
                    {column.label}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-white/50 dark:bg-gray-800/50">
                    {tasks.filter(task => task.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => onAddTask?.(column.id)}
                  className="p-1 hover:bg-white/30 dark:hover:bg-gray-700/30 rounded-full transition-colors"
                >
                  <PlusIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tasks Container */}
            <StrictModeDroppable id={column.id}>
              <div className="p-4 space-y-3 min-h-[calc(100vh-300px)]">
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                    />
                  ))}
              </div>
            </StrictModeDroppable>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
