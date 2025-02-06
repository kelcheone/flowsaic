"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/stores/agents/store";
import { useEffect } from "react";
import Link from "next/link";

export default function AgentsList() {
  const agents = useAgentStore((state) => state.Agents);
  const fetchAgents = useAgentStore((state) => state.fetchAgents);

  useEffect(() => {
    fetchAgents();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader>
            <CardTitle>{agent.name}</CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/agent/${agent.id}`}
              className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
