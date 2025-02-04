import { create } from "zustand";
import supabase from "@/lib/supabaseInit";
import { CreateModule, Module } from "@/types/Modules";

interface ModuleStore {
  module: Module | null;
  Modules: Module[];
  fetchModule: (id: string) => void;
  fetchModulesMangager: () => void;
  addModule: (Module: CreateModule) => void;
  deleteModule: (id: string) => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  module: null,
  Modules: [],
  fetchModule: async (id) => {
    try {
      const { data, error } = await supabase
        .from("Modules")
        .select()
        .match({ id });
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        set({ module: data[0] });
      }
    } catch (error) {
      console.error(error);
    }
  },
  fetchModulesMangager: async () => {
    try {
      const { data, error } = await supabase.from("ModulesManager").select();
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        set({ Modules: data });
      }
    } catch (error) {
      console.error(error);
    }
  },
  addModule: async (module) => {
    // add Module to database
    console.log("add Module", module);
    try {
      const { data, error } = await supabase
        .from("ModulesManager")
        .insert(module)
        .select();
      // update Module with id from database
      console.log("we are here", data);
      if (data) {
        console.log("we are here", data);
        // convert data[0] to Module type
        const newModule = data[0] as Module;
        set((state) => ({
          Modules: [...state.Modules, { ...newModule, id: newModule.id }],
        }));

        console.log("new Module", data[0]);
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  deleteModule: async (id) => {
    set((state) => ({
      Modules: state.Modules.filter((Module) => Module.id !== id.toString()),
    }));
    // delete Module from database
    console.log("delete Module", id);
    try {
      const { error } = await supabase
        .from("ModulesManager")
        .delete()
        .match({ id });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
