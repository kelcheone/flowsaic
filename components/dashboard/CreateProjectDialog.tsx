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
import { useModuleStore } from "@/stores/modulesStore";
import { CreateModule } from "@/types/Modules";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateModuleDialog() {
  const [open, setOpen] = useState(false);
  const [module, setModule] = useState<CreateModule>({
    name: "",
    description: "",
  });

  const addModule = useModuleStore((state) => state.addModule);

  const handleCreateModule = () => {
    addModule(module);
    setOpen(false);
    setModule({
      name: "",
      description: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setModule((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Module Name</Label>
            <Input
              id="name"
              placeholder="Enter module name"
              value={module.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter module description"
              value={module.description}
              onChange={handleInputChange}
            />
          </div>
          <DialogClose asChild>
            <Button className="w-full" onClick={handleCreateModule}>
              Create Module
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
