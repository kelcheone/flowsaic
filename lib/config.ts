// Helper function to clean JWT tokens
const cleanJWT = (jwt: string | undefined): string => {
  if (!jwt) throw new Error("JWT is not defined");
  return jwt.replace(/\s+/g, ""); // Remove all whitespace including line breaks
};

if (!process.env.NODE_A_URL) throw new Error("NODE_A_URL is not defined");
if (!process.env.NODE_B_URL) throw new Error("NODE_B_URL is not defined");
if (!process.env.NODE_C_URL) throw new Error("NODE_C_URL is not defined");
if (!process.env.NODE_A_JWT) throw new Error("NODE_A_JWT is not defined");
if (!process.env.NODE_B_JWT) throw new Error("NODE_B_JWT is not defined");
if (!process.env.NODE_C_JWT) throw new Error("NODE_C_JWT is not defined");

export const NODE_CONFIG = {
  node_a: {
    url: process.env.NODE_A_URL,
    jwt: cleanJWT(process.env.NODE_A_JWT),
  },
  node_b: {
    url: process.env.NODE_B_URL,
    jwt: cleanJWT(process.env.NODE_B_JWT),
  },
  node_c: {
    url: process.env.NODE_C_URL,
    jwt: cleanJWT(process.env.NODE_C_JWT),
  },
} as const;

export const NUM_NODES = process.env.NUM_NODES;
