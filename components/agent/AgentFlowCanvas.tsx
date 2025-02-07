"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  type Connection,
  Background,
  Controls,
  BackgroundVariant,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
  Panel,
  MarkerType,
  DefaultEdgeOptions,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDrop } from "react-dnd";
import ModuleNode from "./ModuleNode";
import { Module } from "@/stores/agents/store";
import { useFlowStore } from "@/stores/agents/flow";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import CustomEdge from "../flow/CustomEdge";
import { scheduler } from "timers/promises";
const nodeTypes = {
  moduleNode: ModuleNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "custom-edge",
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#fff",
  },
  style: {
    strokeWidth: 2,
    stroke: "#fff",
  },
};

type ModuleFlowCanvasProps = {
  id: string;
};

const ModuleFlowCanvas: FC<ModuleFlowCanvasProps> = ({ id }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const setAgentFlowNode = useFlowStore((state) => state.setAgentFlowNode);
  const setAgentFlowEdge = useFlowStore((state) => state.setAgentFlowEdge);
  const saveFlow = useFlowStore((state) => state.saveFlow);
  const fetchFlow = useFlowStore((state) => state.fetchFlow);
  const takeSetNodes = useFlowStore((state) => state.takeSetNodes);
  const takeSetEdges = useFlowStore((state) => state.takeSetEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        // Update nodes in the store for each position change
        changes.forEach((change) => {
          if (change.type === "position" && change.position) {
            // log nodeId and position
            const nodeIndex = updatedNodes.findIndex(
              (node) => node.id === change.id
            );
            if (nodeIndex !== -1) {
              const updatedNode = updatedNodes[nodeIndex];
              setAgentFlowNode(updatedNode);
            }
          }
        });
        return updatedNodes;
      });
    },
    [setAgentFlowNode]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const edgeWithId = {
        ...params,
        id: uuidv4(), // Add unique ID using uuid
        type: "custom-edge",
      };
      // @ts-ignore
      setEdges((es) => addEdge(edgeWithId, es));
      setAgentFlowEdge(edgeWithId);
    },
    [setEdges, setAgentFlowEdge]
  );

  // item: {type, id}
  const [, drop] = useDrop<{ type: string; id: string; data: Module }>({
    accept: "module",
    drop: (item: { type: string; id: string; data: Module }, monitor) => {
      // get id of the module
      console.log(item);
      const position = monitor.getClientOffset();
      if (position) {
        const newNode: Node = {
          id: uuidv4(),
          type: "moduleNode",
          position: { x: position.x - 200, y: position.y - 40 },
          data: {
            name: item.data.name,
            type: item.type,
            inputs: item.data.inputs,
            outputs: item.data.outputs,
            schema: item.data.schema,
            schemaId: item.data.schemaId,
          },
        };
        //@ts-ignore
        setNodes((nds) => nds.concat(newNode));
      }
    },
  });

  useEffect(() => {
    const getFlow = async () => {
      const flow = await fetchFlow(id);
      // Ensure each node has a unique id and is properly initialized
      const initializedNodes = flow.nodes.map((node: Node) => ({
        ...node,
        id: node.id || uuidv4(), // Ensure unique id
        draggable: true, // Make sure nodes are draggable
        connectable: true, // Allow connections
        selectable: true, // Allow selection
      }));
      setNodes(initializedNodes);

      setEdges(flow.edges as Edge[]);

      takeSetNodes(setNodes);
      takeSetEdges(setEdges);
    };
    getFlow();
  }, [id, fetchFlow]);

  const edgeTypes = useMemo(() => ({ "custom-edge": CustomEdge }), []);

  return (
    <div
      // @ts-ignore
      ref={drop}
      className="flex-1"
      style={{
        height: "calc(100vh - 4rem)",
        backgroundColor: "#2D3748",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background
          bgColor="#2D3748"
          gap={16}
          size={2}
          color="#34ebb1"
          variant={BackgroundVariant.Dots}
        />
        <Controls
          style={{
            backgroundColor: "#2D3748",
            color: "#000",
          }}
        />
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

export default ModuleFlowCanvas;
