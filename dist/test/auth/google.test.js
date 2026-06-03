"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../test/mocks/google-auth");
const google_auth_1 = require("../../test/mocks/google-auth");
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../app"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const api_1 = require("../../test/helpers/api");
const constants_1 = require("../../test/helpers/constants");
const db_1 = require("../../test/helpers/db");
const googlePayload = {
    email: "google.user@example.com",
    name: "Google User",
    picture: "https://lh3.googleusercontent.com/a/photo.jpg",
};
function mockGoogleTicket(payload) {
    google_auth_1.mockVerifyIdToken.mockResolvedValueOnce({
        getPayload: () => payload,
    });
}
(0, vitest_1.describe)("POST /api/auth/google", () => {
    (0, vitest_1.beforeEach)(() => {
        google_auth_1.mockVerifyIdToken.mockReset();
    });
    (0, vitest_1.it)("returns 401 when internal API key is missing", async () => {
        const res = await (0, api_1.api)(app_1.default)
            .raw.post("/api/auth/google")
            .send({ token: "fake-token" });
        (0, vitest_1.expect)(res.status).toBe(401);
        (0, vitest_1.expect)(res.body.message).toMatch(/Missing internal API key/i);
    });
    (0, vitest_1.it)("returns 403 when internal API key is invalid", async () => {
        const res = await (0, api_1.api)(app_1.default)
            .raw.post("/api/auth/google")
            .set("x-internal-api-key", "wrong-key")
            .send({ token: "fake-token" });
        (0, vitest_1.expect)(res.status).toBe(403);
        (0, vitest_1.expect)(res.body.message).toMatch(/Invalid internal API key/i);
    });
    (0, vitest_1.it)("returns 400 when Google ticket payload is empty", async () => {
        mockGoogleTicket(null);
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "valid-looking-token" });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/no payload/i);
        (0, vitest_1.expect)(google_auth_1.mockVerifyIdToken).toHaveBeenCalledWith({
            idToken: "valid-looking-token",
            audience: constants_1.GOOGLE_CLIENT_ID,
        });
    });
    (0, vitest_1.it)("returns 500 when Google token verification fails", async () => {
        google_auth_1.mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "invalid-token" });
        (0, vitest_1.expect)(res.status).toBe(500);
        (0, vitest_1.expect)(res.body.message).toMatch(/service internal error/i);
    });
    (0, vitest_1.it)("creates a new user when email is not registered", async () => {
        mockGoogleTicket(googlePayload);
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "new-user-token" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/successfully login with google/i);
        (0, vitest_1.expect)(res.body.data.user.email).toBe(googlePayload.email);
        (0, vitest_1.expect)(res.body.data.user.name).toBe(googlePayload.name);
        (0, vitest_1.expect)(res.body.data.tokens).toBeUndefined();
        const stored = await prisma_1.default.user.findFirst({
            where: { email: googlePayload.email },
        });
        (0, vitest_1.expect)(stored).not.toBeNull();
        (0, vitest_1.expect)(stored?.role).toBe("user");
    });
    (0, vitest_1.it)("returns JWT and session for an existing user", async () => {
        const existing = await (0, db_1.createUser)({
            email: googlePayload.email,
            name: "Old Name",
            picture: "https://example.com/old.png",
        });
        await prisma_1.default.userSession.create({
            data: {
                userID: existing.id,
                userAgent: "old-agent",
                expires_at: new Date(Date.now() + 60_000),
                ipAddres: "10.0.0.1",
            },
        });
        mockGoogleTicket(googlePayload);
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "existing-user-token" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data.tokens).toBeTypeOf("string");
        (0, vitest_1.expect)(res.body.data.user.email).toBe(googlePayload.email);
        const sessions = await prisma_1.default.userSession.findMany({
            where: { userID: existing.id },
        });
        (0, vitest_1.expect)(sessions).toHaveLength(1);
        (0, vitest_1.expect)(sessions[0].userAgent).not.toBe("old-agent");
        const updatedUser = await prisma_1.default.user.findUnique({
            where: { id: existing.id },
        });
        (0, vitest_1.expect)(updatedUser?.picture).toBe(googlePayload.picture);
        (0, vitest_1.expect)(updatedUser?.name).toBe(googlePayload.name);
    });
    (0, vitest_1.it)("returns 400 from controller when service returns null ticket", async () => {
        google_auth_1.mockVerifyIdToken.mockResolvedValueOnce(null);
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "null-ticket-token" });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/bad request/i);
    });
    (0, vitest_1.it)("allows authenticated flow after existing user login", async () => {
        await (0, db_1.createUser)({ email: googlePayload.email });
        mockGoogleTicket(googlePayload);
        const loginRes = await (0, api_1.api)(app_1.default)
            .post("/api/auth/google")
            .send({ token: "session-token" });
        const token = loginRes.body.data.tokens;
        const meRes = await (0, api_1.api)(app_1.default)
            .get("/api/auth/me")
            .set((0, api_1.authHeader)(token));
        (0, vitest_1.expect)(meRes.status).toBe(200);
        (0, vitest_1.expect)(meRes.body.data.email).toBe(googlePayload.email);
    });
    (0, vitest_1.it)("rejects /api/auth/google when INTERNAL_API_SECRET env is unset", async () => {
        const original = process.env.INTERNAL_API_SECRET;
        delete process.env.INTERNAL_API_SECRET;
        const res = await (0, api_1.api)(app_1.default)
            .raw.post("/api/auth/google")
            .set("x-internal-api-key", constants_1.API_KEY)
            .send({ token: "any" });
        process.env.INTERNAL_API_SECRET = original;
        (0, vitest_1.expect)(res.status).toBe(500);
    });
});
