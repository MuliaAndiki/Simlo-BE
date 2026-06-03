"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const vitest_1 = require("vitest");
const prisma_1 = __importDefault(require("../lib/prisma"));
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "ci-test-secret";
process.env.INTERNAL_API_SECRET =
    process.env.INTERNAL_API_SECRET ?? "ci-test-api-key";
process.env.GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID ?? "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET =
    process.env.GOOGLE_CLIENT_SECRET ?? "test-google-client-secret";
(0, vitest_1.beforeAll)(async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL must be set for integration tests");
    }
    (0, child_process_1.execSync)("npx prisma migrate deploy", {
        stdio: "inherit",
        env: process.env,
    });
});
(0, vitest_1.beforeEach)(async () => {
    await prisma_1.default.boundingBox.deleteMany();
    await prisma_1.default.mlResult.deleteMany();
    await prisma_1.default.report.deleteMany();
    await prisma_1.default.userSession.deleteMany();
    await prisma_1.default.user.deleteMany();
});
(0, vitest_1.afterAll)(async () => {
    await prisma_1.default.$disconnect();
});
