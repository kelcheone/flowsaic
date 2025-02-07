import { v4 as uuidv4 } from "uuid";
import { NODE_CONFIG } from "@/lib/config";

export interface SchemaProperty {
  type: string;
  format?: string;
  coerce?: boolean;
}

export interface SchemaDefinition {
  $schema: string;
  type: string;
  items: {
    type: string;
    properties: Record<string, SchemaProperty>;
    required: string[];
    additionalProperties: boolean;
  };
}

const createSchema = async (schema: SchemaDefinition, name: string) => {
  const id = uuidv4();
  console.log(`Creating schema with ID: ${id}`);
  const payload = {
    _id: id,
    name,
    keys: ["_id"],
    schema,
  };

  const TIMEOUT = 30000; // 30 seconds timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const results = await Promise.all(
      Object.entries(NODE_CONFIG).map(async ([nodeName, nodeConfig]) => {
        console.log(`Creating schema on ${nodeName} at URL: ${nodeConfig.url}`);

        const headers = {
          Authorization: `Bearer ${nodeConfig.jwt}`,
          "Content-Type": "application/json",
        };

        const url = new URL("/api/v1/schemas", nodeConfig.url).toString();

        try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal,
            // Add fetch options for better reliability
            cache: "no-cache",
            keepalive: true,
            credentials: "omit",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to create schema on ${nodeName}: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          if (data.errors?.length > 0) {
            throw new Error(
              `Schema creation errors on ${nodeName}: ${data.errors
                .map((error: any) => error.message)
                .join(", ")}`
            );
          }

          console.log(`Schema created successfully on ${nodeName}`);
          return { nodeName, data: data.data };
        } catch (error: any) {
          console.error(`Error for ${nodeName}:`, error.message);
          return {
            nodeName,
            error: error.message || "Unknown error occurred",
            status: "failed",
          };
        }
      })
    );

    // Filter out successful and failed results
    const successful = results.filter((r) => !("error" in r));
    const failed = results.filter((r) => "error" in r);

    if (successful.length === 0) {
      throw new Error("Failed to create schema on all nodes");
    }

    return {
      success: true,
      schemaId: id,
      results: successful,
      failures: failed,
      partialSuccess: failed.length > 0,
    };
  } catch (error: any) {
    console.error(`Error creating schema: ${error.message}`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export { createSchema };
