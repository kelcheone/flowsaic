import ModulePage from "@/components/module/ModulePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="bg-background">
      <ModulePage id={id} />
    </div>
  );
}
