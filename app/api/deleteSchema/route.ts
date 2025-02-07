import { NextApiRequest, NextApiResponse } from "next";
import { deleteSchema } from "@/utils/deleteSchema";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id || typeof _id !== "string") {
      return NextResponse.json(
        { error: "Schema ID is required" },
        { status: 400 }
      );
    }

    console.log("Deleting schema:", _id);

    const result = await deleteSchema(_id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Schema deletion failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete schema" },
      { status: 500 }
    );
  }
}
