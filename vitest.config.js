"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/test/**/*.test.ts"],
        fileParallelism: false,
        pool: "forks",
        maxWorkers: 1,
        testTimeout: 30000,
        hookTimeout: 60000,
    },
    resolve: {
        alias: {
            "@": path_1.default.resolve(__dirname, "./src"),
        },
    },
});
