import supabase from "@/lib/supabaseInit";
import { APINodeData, ModuleFlow, VariableNodeData } from "@/types/Modules";
import { Edge, Node } from "@xyflow/react";
import { create } from "zustand";

interface ModuleFlowStore {
  moduleFlow: ModuleFlow;
  nodes: Node[];
  edges: Edge[];
  setModuleFlow: (moduleFlow: ModuleFlow) => void;
  setModuleFlowEdge: (edge: Edge) => void;
  setModuleFlowNode: (node: Node) => void;
  saveFlow: (id: string) => void;
  fetchModuleFlow: () => void;
  getFlow: (id: string) => Promise<ModuleFlow>;
  saveAPINodeData: (id: string, data: APINodeData) => void;
  saveVariableNodeData: (id: string, data: VariableNodeData) => void;
}

export const useModuleFlowStore = create<ModuleFlowStore>((set, get) => ({
  moduleFlow: {
    nodes: [],
    edges: [],
  },
  nodes: [],
  edges: [],
  setModuleFlow: (moduleFlow) => {
    set({ moduleFlow }), console.log(moduleFlow);
  },
  setModuleFlowEdge: (edge) => {
    set({ edges: [...get().edges, edge] });
    console.log(get().edges);
  },
  setModuleFlowNode: (node) => {
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
    set({ moduleFlow: { nodes: get().nodes, edges: get().edges } });
    try {
      // First check if flow exists
      const { data: existingFlow, error: fetchError } = await supabase
        .from("ModulesFlow")
        .select()
        .match({ module_id: id })
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "not found" error
        throw fetchError;
      }

      let result;
      if (existingFlow) {
        // Update existing flow
        result = await supabase
          .from("ModulesFlow")
          .update({ flow: get().moduleFlow })
          .match({ module_id: id })
          .select();
      } else {
        // Insert new flow
        result = await supabase
          .from("ModulesFlow")
          .insert({ module_id: id, flow: get().moduleFlow })
          .select();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }
      console.log("Flow saved successfully:", result.data);
    } catch (error) {
      console.error("Error saving flow:", error);
    }
  },

  // get both nodes and edges from the store
  fetchModuleFlow: () => {
    console.log(get().nodes);
    console.log(get().edges);
  },
  getFlow: async (id) => {
    // get flow from supabase
    try {
      const { data, error } = await supabase
        .from("ModulesFlow")
        .select()
        .match({ module_id: id });
      if (error) {
        throw new Error(error.message);
      }
      if (data && data.length > 0) {
        console.log(data[0].flow);
        // set nodes and edges in the store
        set({ nodes: data[0].flow.nodes });
        set({ edges: data[0].flow.edges });
        return data[0].flow;
      }
    } catch (error) {
      console.error(error);
    }
  },
  saveAPINodeData: (id, data) => {
    const nodes = get().nodes;
    const index = nodes.findIndex((node) => node.id === id);
    console.log("Index", index);
    if (index !== -1) {
      nodes[index].data = data;
      set({ nodes: nodes });
    }
    console.log(get().nodes);
  },
  saveVariableNodeData: (id, data) => {
    const nodes = get().nodes;
    const index = nodes.findIndex((node) => node.id === id);
    if (index !== -1) {
      nodes[index].data = data;
      set({ nodes: nodes });
    }
    console.log(get().nodes);
  },
}));
