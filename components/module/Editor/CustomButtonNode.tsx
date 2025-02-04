import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";

const CustomButtonNode = ({
  data,
  id,
}: {
  data: { label: string };
  id: string;
}) => {
  return (
    <div className="bg-white p-2 rounded shadow" key={id}>
      <Handle type="target" position={Position.Top} />
      <Button>{data.label}</Button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomButtonNode;
