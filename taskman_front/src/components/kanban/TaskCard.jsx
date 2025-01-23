import { useDraggable } from '@dnd-kit/core';

export const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-4 rounded shadow-sm cursor-move"
    >
      <h4 className="font-medium">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority.toLowerCase()}
        </span>
      </div>
    </div>
  );
}; 