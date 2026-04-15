import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.e2e-spec.ts"],
    passWithNoTests: true,
    testTimeout: 15000,
  },
});
