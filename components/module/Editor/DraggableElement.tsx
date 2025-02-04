import { useDrag } from "react-dnd";
import type React from "react";

interface DraggableElementProps {
  type: string;
  children: React.ReactNode;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  type,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "element",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      {children}
    </div>
  );
};

export default DraggableElement;
