"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../app"));
const api_1 = require("../test/helpers/api");
(0, vitest_1.describe)("GET /", () => {
    (0, vitest_1.it)("returns API health without internal API key", async () => {
        const res = await (0, api_1.api)(app_1.default).raw.get("/");
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)("returns API health with valid internal API key", async () => {
        const res = await (0, api_1.api)(app_1.default).get("/");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.message).toBe("Simlo API!");
        (0, vitest_1.expect)(res.body.timestamp).toBeTypeOf("string");
    });
});
