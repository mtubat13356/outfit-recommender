import { defineConfig } from "vitest/config";

export default defineConfig({
  // Lets tests understand the "@/..." imports from tsconfig.json
  resolve: { tsconfigPaths: true },
  test: {
    // Plain Node is enough for testing functions. (Testing React components
    // later would need a fake browser, "jsdom".)
    environment: "node",
  },
});
