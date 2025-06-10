import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./setup.ts"],
    include: ["**/*.test.ts"],
    exclude: ["node_modules"],
    testTimeout: 60000, // 60 seconds for real API calls
  },
  resolve: {
    alias: {
      "@": "../src",
    },
  },
});
