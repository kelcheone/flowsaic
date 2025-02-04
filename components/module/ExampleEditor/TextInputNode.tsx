import React, { Fragment, memo } from "react";
import { Handle, useStore, Position, useReactFlow } from "@xyflow/react";

const dimensionAttrs = ["width", "height"] as const;
type DimensionAttr = (typeof dimensionAttrs)[number];

interface TextInputNodeProps {
  id: string;
}

interface NodeStyle {
  width: number;
  height: number;
}

interface Node {
  id: string;
  style: NodeStyle;
  position: {
    x: number;
    y: number;
  };
}

export default memo(({ id }: TextInputNodeProps) => {
  const { setNodes } = useReactFlow();
  const dimensions = useStore((s) => {
    const node = s.nodeLookup.get("2-3");
    if (
      !node ||
      !node.measured.width ||
      !node.measured.height ||
      !s.edges.some((edge) => edge.target === id)
    ) {
      return null;
    }
    return {
      width: node.measured.width,
      height: node.measured.height,
    };
  });

  const updateDimension =
    (attr: DimensionAttr) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === "2-3") {
            const parentNode = nds.find((node) => node.id === "2-1");
            const parentWidth = parentNode?.style?.width ?? Infinity;
            const parentHeight = parentNode?.style?.height ?? Infinity;

            const currentNode = nds.find((node) => node.id === "2-3");
            if (!currentNode?.position || !currentNode?.style) return n;

            const currentPosX = currentNode.position.x;
            const currentPosY = currentNode.position.y;

            const maxWidth = Math.max(Number(parentWidth) - currentPosX, 0);
            const maxHeight = Math.max(Number(parentHeight) - currentPosY, 0);

            const newSize: NodeStyle = {
              height:
                attr === "height"
                  ? Math.min(value, maxHeight)
                  : parseInt(String(currentNode.style.height)) ?? 0,
              width:
                attr === "width"
                  ? Math.min(value, maxWidth)
                  : parseInt(String(currentNode.style.width)) ?? 0,
            };

            return {
              ...n,
              style: {
                ...n.style,
                [attr]: newSize[attr] ?? 0,
              },
            };
          }

          return n;
        })
      );
    };

  return (
    <div>
      {dimensionAttrs.map((attr) => (
        <Fragment key={attr}>
          <label>Node {attr}</label>
          <input
            type="number"
            value={dimensions ? parseInt(String(dimensions[attr])) : 0}
            onChange={updateDimension(attr)}
            className="text-input-node__input nodrag"
            disabled={!dimensions}
          />
        </Fragment>
      ))}
      {!dimensionAttrs && "no node connected"}
      <Handle type="target" position={Position.Top} className="custom-handle" />
    </div>
  );
});
