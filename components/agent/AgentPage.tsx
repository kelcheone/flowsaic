"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ModuleSidePanel from "./ModuleSidePanel";
import AgentFlowCanvas from "./AgentFlowCanvas";

type AgentPageProps = {
  agentId: string;
};

export default function AgentPage({ agentId }: AgentPageProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)]">
        <ModuleSidePanel />
        <AgentFlowCanvas id={agentId} />
      </div>
    </DndProvider>
  );
}
