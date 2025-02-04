import type React from "react";
import { useState, useCallback } from "react";
import { Handle, Position, useEdges } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useVariableStore } from "@/stores/variableStore";
import { APINodeData } from "@/types/Modules";
import { useModuleFlowStore } from "@/stores/ModulesManager";

const CustomAPINode = ({ data, id }: { data: APINodeData; id: string }) => {
  const [name, setName] = useState(data.name || "");
  const [method, setMethod] = useState(data.method || "GET");
  const [endpoint, setEndpoint] = useState(data.endpoint || "");
  const [authType, setAuthType] = useState(data.authType || "none");
  const [apiKey, setApiKey] = useState(data.apiKey || "");
  const [bearerToken, setBearerToken] = useState(data.bearerToken || "");
  const [params, setParams] = useState(data.params || "");
  const [headers, setHeaders] = useState(data.headers || "");
  const [body, setBody] = useState(data.body || "");
  const [response, setResponse] = useState(data.response || "");
  const [useUrlParams, setUseUrlParams] = useState(data.useUrlParams || false);

  const edges = useEdges();
  const getVariable = useVariableStore((state) => state.getVariable);

  const getConnectedSourceNodes = useCallback(() => {
    return edges
      .filter((edge) => edge.target === id)
      .map((edge) => edge.source);
  }, [edges, id]);

  const replaceVariables = useCallback(
    (text: string) => {
      const connectedNodes = getConnectedSourceNodes();
      return text.replace(/\$(\w+)/g, (match, varName) => {
        for (const nodeId of connectedNodes) {
          const variable = getVariable(nodeId, varName);
          if (variable) return variable.value;
        }
        // If no variable found, return a placeholder
        return `{{${varName}}}`;
      });
    },
    [getConnectedSourceNodes, getVariable]
  );
  const safeParse = (str: string, fallback = {}) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch (error) {
      console.error("JSON Parse Error:", error, "for input:", str);
      return fallback;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedEndpoint = replaceVariables(endpoint);
    const resolvedApiKey = replaceVariables(apiKey);
    const resolvedBearerToken = replaceVariables(bearerToken);
    const resolvedParams = replaceVariables(params);
    const resolvedHeaders = replaceVariables(headers);
    const resolvedBody = replaceVariables(body);

    // Here you would typically make the API call
    // For demonstration, we'll just set a mock response

    // log the response to results.
    console.log(
      JSON.stringify(
        {
          method,
          endpoint: resolvedEndpoint,
          authType,
          apiKey: resolvedApiKey,
          bearerToken: resolvedBearerToken,
          params: useUrlParams ? resolvedParams : safeParse(resolvedParams),
          headers: headers ? safeParse(resolvedHeaders) : {},
          body: body ? safeParse(resolvedBody) : {},
        },
        null,
        2
      )
    );
  };

  // save nodeData data variable
  const nodeData = {
    name,
    method,
    endpoint,
    authType,
    apiKey,
    bearerToken,
    params,
    headers,
    body,
    response,
    useUrlParams,
  };

  // save nodeData to store
  const saveNodeData = useModuleFlowStore((state) => state.saveAPINodeData);

  // save nodeData to store
  const handleSave = () => {
    console.log("Saving node data", nodeData);
    saveNodeData(id, nodeData);
  };

  return (
    <div className="bg-popover p-4 rounded shadow-md w-96" key={id}>
      <Handle type="target" position={Position.Top} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Node Name</Label>
          <Input
            placeholder="Enter node name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="API Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>

        <div>
          <Label>Authentication</Label>
          <Select value={authType} onValueChange={setAuthType}>
            <SelectTrigger>
              <SelectValue placeholder="Auth Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="apiKey">API Key</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {authType === "apiKey" && (
          <Input
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        )}

        {authType === "bearer" && (
          <Input
            placeholder="Bearer Token"
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
          />
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="url-params"
            checked={useUrlParams}
            onCheckedChange={setUseUrlParams}
          />
          <Label htmlFor="url-params">Use URL Parameters</Label>
        </div>

        <Textarea
          placeholder={
            useUrlParams
              ? "URL Parameters (key=value&key2=value2)"
              : "Parameters (JSON)"
          }
          value={params}
          onChange={(e) => setParams(e.target.value)}
        />

        <Textarea
          placeholder="Headers (JSON)"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />

        <Textarea
          placeholder="Body (JSON)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
          <Button type="submit">Send Request</Button>
        </div>
      </form>

      {response && (
        <div className="mt-4">
          <Label>Response</Label>
          <Textarea value={response} readOnly className="mt-2" rows={10} />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomAPINode;
