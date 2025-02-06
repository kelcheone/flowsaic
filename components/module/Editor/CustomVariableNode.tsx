import { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVariableStore } from "@/stores/variableStore";
import { useModuleFlowStore } from "@/stores/ModulesManager";
import { Trash2 } from "lucide-react";

//variable nodedata
type VariableNodeData = {
  name: string;
  type: string;
  value: string;
};

const CustomVariableNode = ({
  data,
  id,
}: {
  data: VariableNodeData;
  id: string;
}) => {
  const [name, setName] = useState(data.name || "");
  const [type, setType] = useState(data.type || "string");
  const [value, setValue] = useState(data.value || "");
  const setVariable = useVariableStore((state) => state.setVariable);
  const saveVariableNodeData = useModuleFlowStore(
    (state) => state.saveVariableNodeData
  );

  const deleteNode = useModuleFlowStore((state) => state.deleteNode);

  const handleDelete = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  const handleSave = () => {
    const variable = {
      name,
      type,
      value,
    };
    setVariable(id, name, variable);
    saveVariableNodeData(id, variable);
  };

  return (
    <div className="bg-popover p-4 rounded shadow-md w-64" key={id}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Variable Node</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <div className="space-y-4">
        <div>
          <Label htmlFor="var-name">Variable Name</Label>
          <Input
            id="var-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter variable name"
          />
        </div>

        <div>
          <Label htmlFor="var-type">Variable Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="var-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="var-value">Variable Value</Label>
          <Input
            id="var-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter variable value"
          />
        </div>

        <Button onClick={handleSave}>Save Variable</Button>
      </div>
    </div>
  );
};

export default CustomVariableNode;
