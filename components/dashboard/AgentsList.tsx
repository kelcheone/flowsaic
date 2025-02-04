import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function AgentsList() {
  const agents = [
    { id: 1, name: "Trading Agent", description: "Automated trading strategy" },
    {
      id: 2,
      name: "Monitor Agent",
      description: "Price monitoring and alerts",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader>
            <CardTitle>{agent.name}</CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
