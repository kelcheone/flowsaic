import { Button } from "@/components/ui/button";
import DraggableModule from "./DraggableModule";
import { useModuleStore } from "@/stores/agentsModuleStore";
import { useEffect } from "react";
import { useAgentStore } from "@/stores/agents/store";

const ModuleSidePanel = () => {
  const fetchModules = useAgentStore((state) => state.fetchModules);
  const sidePanelModules = useAgentStore((state) => state.sidePanelModules);
  const modules = useAgentStore((state) => state.modules);

  useEffect(() => {
    fetchModules();
  }, []);

  const handleClick = (id: string, type: string) => {
    console.log(modules);
    console.log(type);
  };

  return (
    <div className="w-64 bg-popover p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Modules</h2>
      <div className="space-y-4">
        {sidePanelModules.map((module) => (
          <DraggableModule
            key={module.id}
            id={module.id}
            type={module.type}
            data={modules[module.id]}
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleClick(module.id, module.type)}
            >
              {module.name}
            </Button>
          </DraggableModule>
        ))}
      </div>
    </div>
  );
};

export default ModuleSidePanel;
