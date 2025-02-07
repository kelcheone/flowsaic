import { createSchema } from "@/utils/createSchema";
import { NextResponse } from "next/server";
import type { SchemaDefinition } from "@/utils/createSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schema, name } = body;

    if (!schema || !name) {
      return NextResponse.json(
        { error: "Schema and name are required" },
        { status: 400 }
      );
    }

    const result = await createSchema(schema as SchemaDefinition, name);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Schema creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create schema" },
      { status: 500 }
    );
  }
}
