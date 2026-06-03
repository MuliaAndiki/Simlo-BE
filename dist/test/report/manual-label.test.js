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
const boundingBoxes = [
    { x: 10, y: 20, width: 40, height: 30, label: "berlubang" },
];
(0, vitest_1.describe)("POST /api/report/manual-label/:id", () => {
    (0, vitest_1.it)("returns 401 without bearer token", async () => {
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/report/manual-label/any-id")
            .send({ boundingBoxes });
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)("returns 400 when boundingBoxes is empty", async () => {
        const { token } = await (0, db_1.loginAsUser)();
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/report/manual-label/fake-id")
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes: [] });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)("returns 404 when report does not exist", async () => {
        const { token } = await (0, db_1.loginAsUser)();
        const res = await (0, api_1.api)(app_1.default)
            .post("/api/report/manual-label/00000000-0000-0000-0000-000000000000")
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes });
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)("returns 403 when user is not report owner", async () => {
        const owner = await (0, db_1.createUser)({ email: "owner@example.com" });
        const { report } = await (0, db_1.createReportWithMl)(owner.id, {
            isDetected: false,
        });
        const { token } = await (0, db_1.loginAsUser)({ email: "other@example.com" });
        const res = await (0, api_1.api)(app_1.default)
            .post(`/api/report/manual-label/${report.id}`)
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)("returns 409 when ML already detected for regular user", async () => {
        const { user, token } = await (0, db_1.loginAsUser)();
        const { report } = await (0, db_1.createReportWithMl)(user.id, {
            isDetected: true,
        });
        const res = await (0, api_1.api)(app_1.default)
            .post(`/api/report/manual-label/${report.id}`)
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes });
        (0, vitest_1.expect)(res.status).toBe(409);
    });
    (0, vitest_1.it)("saves manual labels when ML did not detect", async () => {
        const { user, token } = await (0, db_1.loginAsUser)();
        const { report, mlResult } = await (0, db_1.createReportWithMl)(user.id, {
            isDetected: false,
        });
        const res = await (0, api_1.api)(app_1.default)
            .post(`/api/report/manual-label/${report.id}`)
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes, confidenceScore: 1 });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data.mlResult.is_Detected).toBe(true);
        (0, vitest_1.expect)(res.body.data.mlResult.model_version).toBe("manual-v1.0.0");
        (0, vitest_1.expect)(res.body.data.mlResult.boundingbox).toHaveLength(1);
        const updated = await prisma_1.default.mlResult.findUnique({
            where: { id: mlResult.id },
            include: { boundingbox: true },
        });
        (0, vitest_1.expect)(updated?.is_Detected).toBe(true);
        (0, vitest_1.expect)(updated?.boundingbox[0].label).toBe("berlubang");
    });
    (0, vitest_1.it)("allows admin to relabel even when already detected", async () => {
        const owner = await (0, db_1.createUser)({ email: "owner2@example.com" });
        const { report } = await (0, db_1.createReportWithMl)(owner.id, {
            isDetected: true,
        });
        const admin = await (0, db_1.createUser)({
            email: "admin-label@example.com",
            role: "admin",
        });
        const { token } = await (0, db_1.loginAsExistingUser)(admin);
        const res = await (0, api_1.api)(app_1.default)
            .post(`/api/report/manual-label/${report.id}`)
            .set((0, api_1.authHeader)(token))
            .send({ boundingBoxes });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data.mlResult.is_Detected).toBe(true);
    });
});
