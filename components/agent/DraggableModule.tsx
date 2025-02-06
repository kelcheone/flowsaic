import { useDrag } from "react-dnd";
import type React from "react";
import { Module } from "@/stores/agents/store";

interface DraggableModuleProps {
  type: string;
  id: string;
  data?: Module;
  children: React.ReactNode;
}

const DraggableModule: React.FC<DraggableModuleProps> = ({
  type,
  id,
  data,

  children,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "module",

    item: { type, id, data },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // @ts-ignore
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      {children}
    </div>
  );
};

export default DraggableModule;
