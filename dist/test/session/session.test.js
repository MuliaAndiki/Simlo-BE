"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../app"));
const api_1 = require("../../test/helpers/api");
const db_1 = require("../../test/helpers/db");
(0, vitest_1.describe)("Session API", () => {
    (0, vitest_1.describe)("GET /api/session/current", () => {
        (0, vitest_1.it)("returns 401 without bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default).get("/api/session/current");
            (0, vitest_1.expect)(res.status).toBe(401);
        });
        (0, vitest_1.it)("returns current session for authenticated user", async () => {
            const { session, token } = await (0, db_1.loginAsUser)();
            const res = await (0, api_1.api)(app_1.default)
                .get("/api/session/current")
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data.current.id).toBe(session.id);
        });
    });
    (0, vitest_1.describe)("GET /api/session/allCurent", () => {
        (0, vitest_1.it)("returns all sessions for the user", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const res = await (0, api_1.api)(app_1.default)
                .get("/api/session/allCurent")
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data).toHaveLength(1);
            (0, vitest_1.expect)(res.body.data[0].userID).toBe(user.id);
        });
    });
});
