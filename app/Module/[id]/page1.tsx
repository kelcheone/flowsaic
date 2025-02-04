import OverviewFlow from "@/components/module/ExampleEditor/Editor";
import ModulePage from "@/components/module/ModulePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div
      className="bg-background p-4"
      style={{ height: "100vh", width: "100vw" }}
    >
      <ModulePage />
    </div>
  );
}
