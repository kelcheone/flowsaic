import supabase from "@/lib/supabaseInit";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { SchemaDefinition } from "./nillion";

interface NodeData {
  name: string;
  inputs: { [key: string]: string };
  outputs: { [key: string]: string };
  schema: SchemaDefinition;
  schemaId?: string;
  connectedSchemas: Record<string, string>; // or { [key: string]: string }
}

export type FlowStore = {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setAgentFlowNode: (node: Node) => void;
  setAgentFlowEdge: (edge: Edge) => void;
  saveFlow: (id: string) => void;
  fetchFlow: (id: string) => Promise<{ nodes: Node[]; edges: Edge[] }>;
  deletedNodeId: string | null;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  // a funtion that takes a setNode function
  takeSetNodes: (setNodes: Dispatch<SetStateAction<Node[]>>) => void;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  takeSetEdges: (setEdges: Dispatch<SetStateAction<Edge[]>>) => void;
  setEdges: Dispatch<SetStateAction<Edge[]>>;

  // update node with schemaId
  updateNodeSchemaId: (id: string, schemaId: string) => void;
};

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  setAgentFlowEdge: (edge) => {
    // Add the edge
    set({ edges: [...get().edges, edge] });

    // Update the target node to store the source node's schemaId
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id === edge.target) {
          const sourceNode = state.nodes.find((n) => n.id === edge.source);
          // Ensure we're getting the current connectedSchemas or initialize as empty object
          const currentConnectedSchemas = node.data?.connectedSchemas ?? {};

          if (sourceNode?.data?.schemaId) {
            return {
              ...node,
              data: {
                ...node.data,
                connectedSchemas: {
                  ...currentConnectedSchemas,
                  [edge.source]: sourceNode.data.schemaId,
                },
              },
            };
          }
        }
        return node;
      });
      get().setNodes(nodes);
      return { nodes };
    });
    console.log(get().edges);
    console.log(get().nodes);
  },

  setAgentFlowNode: (node) => {
    set((state) => {
      const existingNodeIndex = state.nodes.findIndex((n) => n.id === node.id);
      if (existingNodeIndex !== -1) {
        // Update existing node
        const updatedNodes = [...state.nodes];
        updatedNodes[existingNodeIndex] = node;
        return { nodes: updatedNodes };
      } else {
        // Add new node
        return { nodes: [...state.nodes, node] };
      }
    });
  },
  saveFlow: async (id) => {
    console.log("Saving flow");
    if (!id) {
      console.error("No agent ID provided");
      return;
    }

    const { nodes, edges } = get();
    console.log("Nodes", nodes);
    const flowData = {
      agent_id: id,
      flow: { nodes, edges },
    };
    console.log("Flow data", flowData);
    try {
      const { data, error } = await supabase
        .from("AgentFlow")
        .upsert(flowData, {
          onConflict: "agent_id",
        });

      if (error) {
        console.error("Error saving flow:", error.message);
        throw error;
      }

      console.log("Flow saved successfully");
      return data;
    } catch (error) {
      console.error("Failed to save flow:", error);
      throw error;
    }
  },
  fetchFlow: async (id) => {
    try {
      const { data } = await supabase
        .from("AgentFlow")
        .select("flow")
        .match({ agent_id: id })
        .single();
      if (data) {
        const { nodes, edges } = data.flow;
        set({ nodes, edges });
        return { nodes, edges };
      }
      return { nodes: [], edges: [] };
    } catch (error) {
      console.error(error);
      return { nodes: [], edges: [] };
    }
  },
  deletedNodeId: null,
  deleteNode: (id) => {
    set({ deletedNodeId: id });
    set((state) => {
      // Filter out the deleted node
      const nodes = state.nodes.filter((node) => node.id !== id);

      // Filter out edges connected to the deleted node
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );

      // Clean up connectedSchemas references in all remaining nodes
      const updatedNodes = nodes.map((node) => {
        if (
          node.data?.connectedSchemas &&
          (node.data.connectedSchemas as Record<string, string>)[id]
        ) {
          const { [id]: _, ...remainingSchemas } = node.data
            .connectedSchemas as Record<string, string>;
          return {
            ...node,
            data: {
              ...node.data,
              connectedSchemas: remainingSchemas,
            },
          };
        }
        return node;
      });

      set({ deletedNodeId: null });
      // call setNodes function with the new nodes
      get().setNodes(updatedNodes);
      get().setEdges(edges);
      console.log("Deleted node", id);
      console.log(get().nodes.length);
      return { nodes: updatedNodes, edges };
    });
  },
  setNodes: () => {},
  takeSetNodes: (setNodes) => {
    set({ setNodes });
  },
  setEdges: () => {},
  takeSetEdges: (setEdges) => {
    set({ setEdges });
  },
  deleteEdge: (id) => {
    set((state) => {
      const edgeToDelete = state.edges.find((edge) => edge.id === id);
      const edges = state.edges.filter((edge) => edge.id !== id);

      // Remove the source schemaId from target node's connectedSchemas
      const nodes = state.nodes.map((node) => {
        if (edgeToDelete && node.id === edgeToDelete.target) {
          const { [edgeToDelete.source]: _, ...remainingSchemas } = (node.data
            ?.connectedSchemas || {}) as Record<string, string>;
          return {
            ...node,
            data: {
              ...node.data,
              connectedSchemas: remainingSchemas || {},
            },
          };
        }
        return node;
      });

      get().setEdges(edges);
      get().setNodes(nodes);
      return { edges, nodes };
    });
  },
  updateNodeSchemaId: (id, schemaId) => {
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, schemaId } };
        }
        return node;
      });
      get().setNodes(nodes);
      return { nodes };
    });
  },
}));
