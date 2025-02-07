import { create } from "zustand";
import supabase from "@/lib/supabaseInit";
import { Agent, CreateAgent } from "@/types/Agents";
import { log } from "console";

export type Module = {
  // a module has id, type, inputs and outputs an other data
  id: string;
  type: string;
  name: string;
  inputs: { [key: string]: string };
  outputs: { [key: string]: string };
  data: any;
  schema: any;
  schemaId?: string;
  // nodeId : schemaId
  connectedSchemas?: { [sourceId: string]: string };
};

// listed modules in the side panel
type SidePanelModule = {
  id: string;
  type: string;
  name: string;
};

interface AgentStore {
  Agents: Agent[];
  modules: { [key: string]: Module }; //eg: {id: {name, input1, input2, inputn, moduleOutput}}
  addAgent: (agent: CreateAgent) => void;
  fetchAgents: () => void;
  sidePanelModules: SidePanelModule[];
  fetchModules: () => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  Agents: [] as Agent[],
  modules: {},
  fetchAgents: async () => {
    try {
      const { data, error } = await supabase.from("Agents").select();
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        set({ Agents: data });
      }
    } catch (error) {
      console.error(error);
    }
  },
  addAgent: async (agent) => {
    try {
      const { data, error } = await supabase
        .from("Agents")
        .insert(agent)
        .select();
      if (error) {
        throw error;
      }
      if (data && data.length) {
        const newAgent = data[0] as Agent;
        set((state) => ({
          Agents: [...state.Agents, { ...newAgent, id: newAgent.id }],
        }));
        console.log(data);
      }
    } catch (error) {}
  },
  sidePanelModules: [],
  fetchModules: async () => {
    try {
      const { data, error } = await supabase.from("ModulesFlow").select(`
      *,
      module:module_id (*)
    `);
      if (error) {
        throw error;
      }

      if (data) {
        const modules: { [key: string]: Module } = {};

        set((state) => {
          const existingSidePanelModules = state.sidePanelModules.map(
            (m) => m.id
          );
          const newSidePanelModules = [...state.sidePanelModules];

          data.forEach((item) => {
            if (!existingSidePanelModules.includes(item.id)) {
              const sidePanelModule: SidePanelModule = {
                id: item.id,
                type: "customModuleNode",
                name: item.module.name,
              };
              newSidePanelModules.push(sidePanelModule);
            }

            // Set module only if not already present
            if (!modules[item.id]) {
              modules[item.id] = {
                id: item.id,
                name: item.module.name,
                type: "customModuleNode",
                inputs: {},
                outputs: {},
                data: {},
                schema: item.flow.schema,
              };
              console.log(item.flow.schema);

              // Get inputs and outputs
              item.flow.nodes.forEach((node: any) => {
                if (node.type === "customVarible") {
                  modules[item.id].inputs[node.data.name] = node.data.name;
                }
              });
            }
          });

          return { sidePanelModules: newSidePanelModules, modules };
        });
      }
    } catch (error) {
      console.error("Error fetching modules", error);
    }
  },
}));

// a module would look like this in the canvas
/*
 {
 name,
 input1,
 input2,
 inputn,
 moduleOutput
 }
*/
