"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useModuleStore } from "@/stores/modulesStore";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ModulesList() {
  const modules = useModuleStore((state) => state.Modules);
  const fetchModules = useModuleStore((state) => state.fetchModulesMangager);
  const deleteModule = useModuleStore((state) => state.deleteModule);

  const router = useRouter();

  useEffect(() => {
    fetchModules();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <CardTitle>{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Link
                href={`/Module/${module.id}`}
                className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                View
              </Link>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteModule(module.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
