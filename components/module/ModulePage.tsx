"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SidePanel from "@/components/module/Editor/SidePanel";
import FlowCanvas from "@/components/module/Editor/FlowCanvas";
import { FC } from "react";
type ModulePageProps = {
  id: string;
};
const ModulePage: FC<ModulePageProps> = ({ id }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <SidePanel />
        <FlowCanvas id={id} />
      </div>
    </DndProvider>
  );
};

export default ModulePage;
