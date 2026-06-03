"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../app"));
const api_1 = require("../../test/helpers/api");
const db_1 = require("../../test/helpers/db");
(0, vitest_1.describe)("POST /api/auth/developer", () => {
    (0, vitest_1.it)("returns 404 when email is missing", async () => {
        const res = await (0, api_1.api)(app_1.default).post("/api/auth/developer").send({});
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/body not found/i);
    });
    (0, vitest_1.it)("returns 404 when email is not registered", async () => {
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/developer")
            .send({ email: "unknown@example.com" });
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/email not registered/i);
    });
    (0, vitest_1.it)("returns JWT for a registered developer user", async () => {
        await (0, db_1.createUser)({
            email: "dev@example.com",
            role: "admin",
        });
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/developer")
            .send({ email: "dev@example.com" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data.tokens).toBeTypeOf("string");
    });
});
