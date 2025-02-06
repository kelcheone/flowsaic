import { CircleX } from "lucide-react";
import { FC } from "react";
import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useFlowStore } from "@/stores/agents/flow";

const CustomEdge: FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;

  const { setEdges } = useReactFlow();
  const flowSetEdges = useFlowStore((state) => state.setEdges);
  const deleteEdge = useFlowStore((state) => state.deleteEdge);

  const [edgepath, labelX, labelY] = getBezierPath({
    sourceY,
    sourceX,
    targetY,
    targetX,
    targetPosition,
    sourcePosition,
  });

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan bg-warning rounded-full p-1   cursor-pointer"
          onClick={() => {
            setEdges((edges) => edges.filter((e) => e.id !== id));
            flowSetEdges((edges) => edges.filter((e) => e.id !== id));
            deleteEdge(id);
          }}
        >
          <CircleX className="w-4 h-4 text-red-300" />
        </button>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
