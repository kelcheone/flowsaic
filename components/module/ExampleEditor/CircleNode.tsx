import React, { memo } from "react";
import { Handle, useStore, Position } from "@xyflow/react";

interface CircleNodeProps {
  id: string;
}

export default memo(({ id }: CircleNodeProps) => {
  const label = useStore((s) => {
    const node = s.nodeLookup.get(id);

    if (!node) {
      return null;
    }

    return `Position x:${parseInt(node.position.x.toString())} y:${parseInt(
      node.position.y.toString()
    )}`;
  });

  return (
    <div>
      <div>{label || "no node connected"}</div>
      <Handle
        type="target"
        position={Position.Left}
        className="custom-handle"
      />
    </div>
  );
});
