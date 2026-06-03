import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    globalSetup: ["./src/test/global-setup.ts"],
    setupFiles: ["./src/test/setup.ts"],
    env: {
      TF_CPP_MIN_LOG_LEVEL: "2",
      TF_ENABLE_ONEDNN_OPTS: "0",
    },
    include: ["src/test/**/*.test.ts"],
    fileParallelism: false,
    pool: "forks",
    maxWorkers: 1,
    testTimeout: 30000,
    hookTimeout: 60000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
