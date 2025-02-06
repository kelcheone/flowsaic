"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAgentStore } from "@/stores/agents/store";

export default function CreateAgentDialog() {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState({
    name: "",
    description: "",
  });

  const addAgent = useAgentStore((state) => state.addAgent);

  const handleCreateAgent = () => {
    // TODO: Implement agent creation logic using useAgentStore
    setOpen(false);
    addAgent(agent);
    setAgent({
      name: "",
      description: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAgent((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="Enter agent name"
              value={agent.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter agent description"
              value={agent.description}
              onChange={handleInputChange}
            />
          </div>
          <DialogClose asChild>
            <Button className="w-full" onClick={handleCreateAgent}>
              Create Agent
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
