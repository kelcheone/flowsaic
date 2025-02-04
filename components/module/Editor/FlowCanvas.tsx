"use client";

import { useCallback, useEffect, useState } from "react";
//uuid
import { v4 as uuidv4 } from "uuid";
import {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  Background,
  Controls,
  ReactFlow,
  Panel,
  ReactFlowProvider,
  BackgroundVariant,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDrop } from "react-dnd";
import CustomInputNode from "./CustomInputNode";
import CustomButtonNode from "./CustomButtonNode";
import { useModuleFlowStore } from "@/stores/ModulesManager";
import { Button } from "@/components/ui/button";
import CustomAPINode from "./CustomAPINode";
import CustomVariableNode from "./CustomVariableNode";
import {
  addNewAPINode,
  addNewButtonNode,
  addNewInputNode,
  addNewVariableNode,
} from "./newNode";

const nodeTypes = {
  customInput: CustomInputNode,
  customButton: CustomButtonNode,
  customApi: CustomAPINode,
  customVarible: CustomVariableNode,
};

type FlowCanvasProps = {
  id: string;
};

const FlowCanvas: React.FC<FlowCanvasProps> = ({ id }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const setModuleFlowNode = useModuleFlowStore(
    (state) => state.setModuleFlowNode
  );
  const setMouleFlowEdge = useModuleFlowStore(
    (state) => state.setModuleFlowEdge
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        // Update nodes in the store for each position change
        changes.forEach((change) => {
          if (change.type === "position" && change.position) {
            const nodeIndex = updatedNodes.findIndex(
              (node) => node.id === change.id
            );
            if (nodeIndex !== -1) {
              const updatedNode = updatedNodes[nodeIndex];
              setModuleFlowNode(updatedNode);
            }
          }
        });
        return updatedNodes;
      });
    },
    [setModuleFlowNode]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const getFlow = useModuleFlowStore((state) => state.getFlow);
  const saveFlow = useModuleFlowStore((state) => state.saveFlow);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const edgeWithId = {
        ...params,
        id: uuidv4(), // Add unique ID using uuid
      };
      // @ts-ignore
      setEdges((es) => addEdge(edgeWithId, es));
      setMouleFlowEdge(edgeWithId);
    },
    [setEdges, setMouleFlowEdge]
  );

  const [, drop] = useDrop({
    accept: "element",
    drop: (item: { type: string }, monitor) => {
      const position = monitor.getClientOffset();
      if (position) {
        let type = "";
        let newNode: Node;
        switch (item.type) {
          case "input":
            type = "customInput";
            newNode = addNewInputNode(position, item, nodes, type);
            break;
          case "button":
            type = "customButton";
            newNode = addNewButtonNode(position, item, nodes, type);

            break;
          case "api":
            type = "customApi";
            newNode = addNewAPINode(position, item, nodes, type);
            break;
          case "variable":
            type = "customVarible";
            newNode = addNewVariableNode(position, item, nodes, type);
            break;
          default:
            type = "customInput";
            newNode = addNewInputNode(position, item, nodes, type);
        }
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        setModuleFlowNode(newNode);
      }
    },
  });

  useEffect(() => {
    const fetchFlow = async () => {
      const flow = await getFlow(id);
      if (flow) {
        setNodes(flow.nodes as never);
        setEdges(flow.edges as never);
      }
    };
    fetchFlow();
  }, [id]);

  return (
    // @ts-ignore
    <div ref={drop} className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        draggable={true}
        nodesDraggable={true}
      >
        {/* darkish bg , emerald 400 color */}
        <Background
          bgColor="#2D3748"
          gap={16}
          size={2}
          color="#34ebb1"
          variant={BackgroundVariant.Dots}
        />

        <Controls />

        <Panel position="top-left">
          <div className="flex flex-row bg-secondary p-2 rounded shadow">
            <div className="bg-secondary p-2 rounded shadow">
              <Button type="button" onClick={() => console.log("fetch")}>
                Fetch Module Flow
              </Button>
            </div>
            <div className="bg-secondary p-2 rounded shadow">
              <Button type="button" onClick={() => saveFlow(id)}>
                Save Flow
              </Button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
// const FlowCanvasWrapper = () => {
//   return (
//     <ReactFlowProvider>
//       <FlowCanvas />
//     </ReactFlowProvider>
//   );
// };

// export default FlowCanvasWrapper;
