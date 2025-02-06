interface VariableSchema {
  type: string;
  format?: string;
  coerce?: boolean;
}

export class SchemaManager {
  static generateSchema(
    variables: Record<string, { value: any; type: string }>
  ): object {
    const properties: Record<string, VariableSchema> = {
      _id: {
        type: "string",
        format: "uuid",
        coerce: true,
      },
    };

    // Filter out empty keys and invalid variable names
    const validVariables = Object.entries(variables).filter(([key]) => {
      return (
        key &&
        key.trim().length > 0 &&
        /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) &&
        key !== "_id" // Prevent duplicating _id field
      );
    });

    for (const [key, variable] of validVariables) {
      properties[key] = {
        type: variable.type || this.inferType(variable.value),
      };

      if (this.isDateTime(variable.value)) {
        properties[key].format = "date-time";
        properties[key].coerce = true;
      }
    }

    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "array",
      items: {
        type: "object",
        properties,
        required: ["_id", ...validVariables.map(([key]) => key)],
        additionalProperties: false,
      },
    };
  }

  private static inferType(value: any): string {
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    return "string"; // default fallback
  }

  private static isDateTime(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
  }
}
