import { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useModuleStore } from "@/stores/agentsModuleStore";
import { FlaskConicalIcon, Trash2 } from "lucide-react"; // Add this import
import { useFlowStore } from "@/stores/agents/flow";
import { SchemaDefinition, useNillionStore } from "@/stores/agents/nillion";

interface ModuleNodeProps {
  id: string;
  type: string;
  data: {
    name: string;
    inputs: { [key: string]: string };
    outputs: { [key: string]: string };
    schema: SchemaDefinition;
    schemaId: string;
  };
}

const ModuleNode: React.FC<ModuleNodeProps> = ({ id, type, data }) => {
  const [inputs, setInputs] = useState(data.inputs);
  const setModuleData = useModuleStore((state) => state.setModuleData);
  const runModule = useModuleStore((state) => state.runModule);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const createSchema = useNillionStore((state) => state.createSchema);
  const updateNodeSchemaId = useFlowStore((state) => state.updateNodeSchemaId);
  const deleteSchema = useNillionStore((state) => state.deleteSchema);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setModuleData(id, {
      inputs: { ...inputs, [key]: value },
      outputs: data.outputs,
    });
  };

  const handleTest = useCallback(() => {
    // runModule(id, type, inputs);
    console.log(data);
  }, [id, type, inputs, runModule]);

  const handleIntializeSchema = useCallback(() => {
    (async () => {
      const schemaId = await createSchema(data.schema, data.name);
      updateNodeSchemaId(id, schemaId);
      // also update data.schemaId
      data.schemaId = schemaId;
    })();
  }, [data, createSchema, updateNodeSchemaId]);

  const handleDelete = useCallback(() => {
    deleteNode(id);

    deleteSchema(data.schemaId);
  }, [id, deleteNode]);

  return (
    <div className="bg-popover p-4 rounded shadow-md w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{data.name || type}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Handle type="target" position={Position.Top} />
      <div className="space-y-2">
        {Object.entries(inputs).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={`${id}-${key}`}>{key}</Label>
            <Input
              id={`${id}-${key}`}
              placeholder={key}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handleIntializeSchema}>
          {data.schemaId ? "Reinitialize Schema" : "Initialize Schema"}
        </Button>
        <Button
          onClick={handleTest}
          variant="ghost"
          size="icon"
          className="mt-4"
        >
          <FlaskConicalIcon className="h-4 w-4 mr-2" />
        </Button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ModuleNode;
