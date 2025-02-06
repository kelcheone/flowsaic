import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import odulesList from "@/components/dashboard/ModulesList";
import AgentsList from "@/components/dashboard/AgentsList";
import CreateProjectDialog from "@/components/dashboard/CreateProjectDialog";
import ModulesList from "@/components/dashboard/ModulesList";
import CreateAgentDialog from "@/components/dashboard/CreateAgentDialog";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4 bg-background  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <CreateProjectDialog />
        <CreateAgentDialog />
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <ModulesList />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <AgentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
