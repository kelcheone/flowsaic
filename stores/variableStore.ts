import { create } from "zustand";

type VariableType = {
  type: string;
  value: string;
};

type VariableStore = {
  variables: Record<string, Record<string, VariableType>>;
  setVariable: (nodeId: string, name: string, variable: VariableType) => void;
  getVariable: (nodeId: string, name: string) => VariableType | undefined;
};

export const useVariableStore = create<VariableStore>((set, get) => ({
  variables: {},
  setVariable: (nodeId, name, variable) => {
    set((state) => ({
      variables: {
        ...state.variables,
        [nodeId]: {
          ...state.variables[nodeId],
          [name]: variable,
        },
      },
    })),
      console.log(get().variables);
  },
  getVariable: (nodeId, name) => {
    const nodeVariables = get().variables[nodeId];
    return nodeVariables ? nodeVariables[name] : undefined;
  },
}));
