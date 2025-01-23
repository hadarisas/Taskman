import { useDroppable } from "@dnd-kit/core";


export const StrictModeDroppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className="min-h-[50px]">
      {children}
    </div>
  );
}; 