"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../app"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const api_1 = require("../../test/helpers/api");
const db_1 = require("../../test/helpers/db");
(0, vitest_1.describe)("Auth protected endpoints", () => {
    (0, vitest_1.describe)("GET /api/auth/me", () => {
        (0, vitest_1.it)("returns 401 without bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default).get("/api/auth/me");
            (0, vitest_1.expect)(res.status).toBe(401);
        });
        (0, vitest_1.it)("returns 403 with invalid bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default)
                .get("/api/auth/me")
                .set((0, api_1.authHeader)("not-a-valid-jwt"));
            (0, vitest_1.expect)(res.status).toBe(403);
        });
        (0, vitest_1.it)("returns current user profile", async () => {
            const { user, token } = await (0, db_1.loginAsUser)({
                email: "me@example.com",
            });
            const res = await (0, api_1.api)(app_1.default)
                .get("/api/auth/me")
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data.id).toBe(user.id);
            (0, vitest_1.expect)(res.body.data.email).toBe("me@example.com");
        });
    });
    (0, vitest_1.describe)("POST /api/auth/logout", () => {
        (0, vitest_1.it)("returns 401 without bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default).post("/api/auth/logout");
            (0, vitest_1.expect)(res.status).toBe(401);
        });
        (0, vitest_1.it)("deletes all sessions for the user", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const res = await (0, api_1.api)(app_1.default)
                .post("/api/auth/logout")
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            const sessions = await prisma_1.default.userSession.findMany({
                where: { userID: user.id },
            });
            (0, vitest_1.expect)(sessions).toHaveLength(0);
        });
    });
    (0, vitest_1.describe)("PATCH /api/auth/picture", () => {
        (0, vitest_1.it)("returns 401 without bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default)
                .patch("/api/auth/picture")
                .send({ picture: "https://example.com/new.png" });
            (0, vitest_1.expect)(res.status).toBe(401);
        });
        (0, vitest_1.it)("updates user picture", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const newPicture = "https://example.com/updated.png";
            const res = await (0, api_1.api)(app_1.default)
                .patch("/api/auth/picture")
                .set((0, api_1.authHeader)(token))
                .send({ picture: newPicture });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data.patch.picture).toBe(newPicture);
            const updated = await prisma_1.default.user.findUnique({ where: { id: user.id } });
            (0, vitest_1.expect)(updated?.picture).toBe(newPicture);
        });
    });
});
