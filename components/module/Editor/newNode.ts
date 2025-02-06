// a node can be ButtonNode, InputNode, VariableNode, APINode
// each node has differentNodeData

import { APINodeData } from "@/types/Modules";
import { Node } from "@xyflow/react";
import { XYCoord } from "react-dnd";
import { v4 as uuidv4 } from "uuid";

export const addNewButtonNode = (
  position: XYCoord,
  item: any,
  nodes: Node[],
  type: string
) => {
  const newNode: Node = {
    id: uuidv4(),
    type: type,
    position: { x: position.x - 200, y: position.y - 40 },
    data: { label: `${item.type} node` },
  };
  return newNode;
};

export const addNewInputNode = (
  position: XYCoord,
  item: any,
  nodes: Node[],
  type: string
) => {
  const newNode: Node = {
    id: uuidv4(),
    type: type,
    position: { x: position.x - 200, y: position.y - 40 },
    data: { label: `${item.type} node` },
  };
  return newNode;
};

export const addNewVariableNode = (
  position: XYCoord,
  item: any,
  nodes: Node[],
  type: string
) => {
  const newNode: Node = {
    id: uuidv4(),
    type: type,
    position: { x: position.x - 200, y: position.y - 40 },
    data: { label: `${item.type} node` },
  };
  return newNode;
};

export const addNewAPINode = (
  position: XYCoord,
  item: any,
  nodes: Node[],
  type: string
) => {
  const newNode: Node<APINodeData> = {
    id: uuidv4(),
    type: type,
    position: { x: position.x - 200, y: position.y - 40 },
    data: {
      name: "An API Node",
      method: "GET",
      endpoint: "",
      authType: "none",
      useUrlParams: false,
    },
  };

  return newNode;
};
