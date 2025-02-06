import AgentPage from "@/components/agent/AgentPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="bg-background">
      <AgentPage agentId={id} />
    </div>
  );
}
