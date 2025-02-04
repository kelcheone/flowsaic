import { Edge, Node } from "@xyflow/react";

export type CreateModule = {
  id?: string;
  name: string;
  description: string;
};

export type Module = {
  id: string;
  name: string;
  description: string;
};

export interface ModuleFlow {
  nodes: Node[];
  edges: Edge[];
}

// custom node

export type APINodeData = {
  name: string;
  method: string;
  endpoint: string;
  authType: string;
  apiKey?: string;
  bearerToken?: string;
  params?: string;
  headers?: string;
  body?: string;
  response?: string;
  useUrlParams?: boolean;
};

export type VariableNodeData = {
  name: string;
  type: string;
  value: string;
};
