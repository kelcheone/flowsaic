import supabase from "@/lib/supabaseInit";
import {
  APINodeData,
  ModuleFlow,
  VariableNodeData,
  VariableType,
} from "@/types/Modules";
import { Edge, Node } from "@xyflow/react";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { SchemaManager } from "@/utils/schemaManager";

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
  deletedNodeId: string | null;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  // a funtion that takes a setNode function
  takeSetNodes: (setNodes: Dispatch<SetStateAction<Node[]>>) => void;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  takeSetEdges: (setEdges: Dispatch<SetStateAction<Edge[]>>) => void;
  setEdges: Dispatch<SetStateAction<Edge[]>>;

  // handle variables
  variables: Record<string, Record<string, VariableType>>;
  setVariable: (nodeId: string, name: string, variable: VariableType) => void;
  getVariable: (nodeId: string, name: string) => VariableType | undefined;
  getNodeVariables: (nodeId: string) => Record<string, VariableType>;
  logVariables: () => void;
  schema: object | null;
  updateSchema: () => void;
}

const defaultSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        format: "uuid",
        coerce: true,
      },
      module_output: {
        type: "object",
      },
    },
    required: ["_id", "module_output"],
    additionalProperties: false,
  },
};
export const useModuleFlowStore = create<ModuleFlowStore>((set, get) => ({
  moduleFlow: {
    nodes: [],
    edges: [],
    schema: null,
  },
  nodes: [],
  edges: [],
  schema: null,
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
    const flowData = {
      nodes: get().nodes,
      edges: get().edges,
      schema: get().schema || defaultSchema,
    };

    set({ moduleFlow: flowData });
    console.log("Saving flow:", flowData);

    try {
      // First check if flow exists
      const { data: existingFlow, error: fetchError } = await supabase
        .from("ModulesFlow")
        .select()
        .match({ module_id: id })
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let result;
      if (existingFlow) {
        // Update existing flow
        result = await supabase
          .from("ModulesFlow")
          .update({ flow: flowData })
          .match({ module_id: id })
          .select();
      } else {
        // Insert new flow
        result = await supabase
          .from("ModulesFlow")
          .insert({ module_id: id, flow: flowData })
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
    try {
      const { data, error } = await supabase
        .from("ModulesFlow")
        .select()
        .match({ module_id: id });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const flowData = data[0].flow;
        // set nodes, edges and schema in the store
        set({
          nodes: flowData.nodes,
          edges: flowData.edges,
          schema: flowData.schema || null, // handle legacy flows that might not have schema
        });
        return flowData;
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
  },
  deletedNodeId: null,
  deleteNode: (id) => {
    set({ deletedNodeId: id });
    console.log("Deleting node", id);
    set((state) => {
      console.log(
        "Deleting node",
        state.nodes.find((node) => node.id === id)
      );
      console.log("number of nodes before deletion", state.nodes.length);

      // Remove node from nodes array
      const nodes = state.nodes.filter((node) => node.id !== id);

      // Remove connected edges
      const edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );

      // Remove variables associated with this node
      const { [id]: deletedVars, ...remainingVars } = state.variables;

      // Generate new schema without the deleted node's variables
      const allVariables: Record<string, any> = {};
      Object.values(remainingVars).forEach((nodeVars) => {
        Object.entries(nodeVars).forEach(([varName, varValue]) => {
          allVariables[varName] = varValue.value;
        });
      });

      const newSchema = SchemaManager.generateSchema(allVariables);

      set({ deletedNodeId: null });
      get().setNodes(nodes);
      get().setEdges(edges);

      return {
        nodes,
        edges,
        variables: remainingVars,
        schema: newSchema,
      };
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
  variables: {},
  setVariable: (nodeId, name, variable) => {
    set((state) => {
      // Find old variable name if this is a rename operation
      const oldVarName = Object.keys(state.variables[nodeId] || {}).find(
        (key) =>
          key !== name && state.variables[nodeId][key].value === variable.value
      );

      // Convert "json" type to "object"
      const updatedVariable = {
        ...variable,
        type: variable.type === "json" ? "object" : variable.type,
      };

      // Create new state with updated variables
      const newState = {
        variables: {
          ...state.variables,
          [nodeId]: {
            ...state.variables[nodeId],
            [name]: updatedVariable,
          },
        },
      };

      // If this was a rename, remove the old variable name
      if (oldVarName) {
        delete newState.variables[nodeId][oldVarName];
      }

      // After updating variables, generate new schema
      const allVariables: Record<string, any> = {};
      Object.values(newState.variables).forEach((nodeVars) => {
        Object.entries(nodeVars).forEach(([varName, varValue]) => {
          // Only add if variable name is not empty and valid
          if (
            varName &&
            varName.trim() &&
            /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)
          ) {
            allVariables[varName] = {
              type: varValue.type,
              value: varValue.value,
              isSecure: varValue.isSecure,
            };
          }
        });
      });

      const newSchema = SchemaManager.generateSchema(allVariables);
      return { ...newState, schema: newSchema };
    });
  },

  updateSchema: () => {
    const allVariables: Record<string, any> = {};
    Object.values(get().variables).forEach((nodeVars) => {
      Object.entries(nodeVars).forEach(([varName, varValue]) => {
        allVariables[varName] = varValue.value;
      });
    });

    const newSchema = SchemaManager.generateSchema(allVariables);
    set({ schema: newSchema });
  },

  getVariable: (nodeId, name) => {
    return get().variables[nodeId]?.[name];
  },
  getNodeVariables: (nodeId) => {
    return get().variables[nodeId] || {};
  },
  logVariables: () => {
    console.log(get().variables);
    console.log(get().schema);
  },
}));
