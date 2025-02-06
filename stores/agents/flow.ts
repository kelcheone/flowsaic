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
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

export type FlowStore = {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
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

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, type: "custom-edge" }, get().edges),
    });
  },

  setAgentFlowEdge: (edge) => {
    set({ edges: [...get().edges, edge] });
    console.log(get().edges);
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
      const nodes = state.nodes.filter((node) => node.id !== id);
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
      set({ deletedNodeId: null });
      // call setNodes function with the new nodes
      get().setNodes(nodes);
      get().setEdges(edges);
      console.log("Deleted node", id);
      console.log(get().nodes.length);
      return { nodes, edges };
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
      const edges = state.edges.filter((edge) => edge.id !== id);
      get().setEdges(edges);
      return { edges };
    });
  },
}));
