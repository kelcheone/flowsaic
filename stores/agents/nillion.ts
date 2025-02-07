import { create } from "zustand";

export type SchemaProperty = {
  type: string;
  format?: string;
  coerce?: boolean;
};

export type SchemaDefinition = {
  $schema: string;
  type: string;
  items: {
    type: string;
    properties: Record<string, SchemaProperty>;
    required: string[];
    additionalProperties: boolean;
  };
};

interface NillionStore {
  isLoading: boolean;
  error: string | null;
  createSchema: (schema: SchemaDefinition, name: string) => Promise<string>;
  deleteSchema: (schemaId: string) => Promise<void>;
}

export const useNillionStore = create<NillionStore>((set) => ({
  isLoading: false,
  error: null,
  createSchema: async (schema: SchemaDefinition, name: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch("/api/createSchema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schema, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create schema");
      }

      const result = await response.json();
      console.log("Schema created:", result);
      // return the ID of the created schema
      return result.schemaId;
    } catch (error) {
      console.error("Error creating schema:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteSchema: async (schemaId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/deleteSchema`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: schemaId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete schema");
      }

      console.log("Schema deleted successfully");
    } catch (error) {
      console.error("Error deleting schema:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
