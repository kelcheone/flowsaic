import supabase from "@/lib/supabaseInit";
import { create } from "zustand";
import { SchemaDefinition } from "./agents/nillion";

interface ModuleData {
  type: string;
  inputs: { [key: string]: string };
  outputs: { [key: string]: string };
  schema: SchemaDefinition;
  schemaId?: string;
}

type Module = {
  id: string;
  type: string;
  inputs: { [key: string]: string };
};

interface ModuleStore {
  modules: { [key: string]: ModuleData };
  addModule: (id: string, type: string, schema: SchemaDefinition) => void;
  setModuleData: (id: string, data: Partial<ModuleData>) => void;
  runModule: (
    id: string,
    type: string,
    inputs: { [key: string]: string }
  ) => void;
  deleteNode: (id: string) => void;
}

export const useModuleStore = create<ModuleStore>((set, get) => ({
  modules: {},
  addModule: (id, type, schema) => {
    set((state) => ({
      modules: {
        ...state.modules,
        [id]: {
          type,
          inputs: {},
          outputs: {},
          schema,
        },
      },
    }));
  },
  setModuleData: (id, data) => {
    set((state) => ({
      modules: {
        ...state.modules,
        [id]: { ...state.modules[id], ...data },
      },
    }));
  },
  runModule: (id, type, inputs) => {
    // Simulate module execution
    console.log(`Running module ${id} of type ${type} with inputs:`, inputs);
    const outputs = { result: `Processed ${Object.values(inputs).join(", ")}` };
    set((state) => ({
      modules: {
        ...state.modules,
        [id]: { ...state.modules[id], outputs },
      },
    }));
  },
  deleteNode: (id) => {
    set((state) => {
      const { [id]: _, ...modules } = state.modules;
      return { modules };
    });
  },
}));
