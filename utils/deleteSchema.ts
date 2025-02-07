import { NODE_CONFIG } from "@/lib/config";

const deleteSchema = async (schemaId: string) => {
  const TIMEOUT = 30000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const results = await Promise.all(
      Object.entries(NODE_CONFIG).map(async ([nodeName, nodeConfig]) => {
        console.log(`Deleting schema on ${nodeName} at URL: ${nodeConfig.url}`);

        const headers = {
          Authorization: `Bearer ${nodeConfig.jwt}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        const url = new URL("/api/v1/schemas", nodeConfig.url).toString();

        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ id: schemaId }),
            signal: controller.signal,
            cache: "no-cache",
            keepalive: true,
            credentials: "omit",
            redirect: "follow",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to delete schema on ${nodeName}: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          if (data.errors?.length > 0) {
            throw new Error(
              `Schema deletion errors on ${nodeName}: ${data.errors
                .map((error: any) => error.message)
                .join(", ")}`
            );
          }

          console.log(`Schema deleted successfully on ${nodeName}`);
          return { nodeName, success: true };
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
      throw new Error("Failed to delete schema on all nodes");
    }

    return {
      success: true,
      schemaId,
      results: successful,
      failures: failed,
      partialSuccess: failed.length > 0,
    };
  } catch (error: any) {
    console.error(`Error deleting schema: ${error.message}`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export { deleteSchema };
