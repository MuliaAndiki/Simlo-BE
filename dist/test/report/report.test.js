"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../test/mocks/models-service");
const models_service_1 = require("../../test/mocks/models-service");
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../app"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const api_1 = require("../../test/helpers/api");
const db_1 = require("../../test/helpers/db");
const reportBody = {
    city: "Jakarta",
    address_detail: "Jl. Sudirman",
    image_url: "https://example.com/report.jpg",
    latitude: -6.2,
    longitude: 106.816666,
    reportStatus: "isPending",
};
(0, vitest_1.describe)("Report API", () => {
    (0, vitest_1.beforeEach)(() => {
        models_service_1.mockGetPrediction.mockResolvedValue({
            is_Detected: false,
            confidenceScore: 0.2,
            model_version: "v1.0.0",
            processed_at: new Date(),
            boundingBoxes: [],
        });
    });
    (0, vitest_1.describe)("POST /api/report/created", () => {
        (0, vitest_1.it)("returns 401 without bearer token", async () => {
            const res = await (0, api_1.api)(app_1.default)
                .post("/api/report/created")
                .send(reportBody);
            (0, vitest_1.expect)(res.status).toBe(401);
        });
        (0, vitest_1.it)("creates report and ML result", async () => {
            const { token } = await (0, db_1.loginAsUser)();
            const res = await (0, api_1.api)(app_1.default)
                .post("/api/report/created")
                .set((0, api_1.authHeader)(token))
                .send(reportBody);
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body.data.createed.city).toBe("Jakarta");
            (0, vitest_1.expect)(res.body.data.resultModels.is_Detected).toBe(false);
            (0, vitest_1.expect)(models_service_1.mockGetPrediction).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("GET /api/report/report", () => {
        (0, vitest_1.it)("returns all reports", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            await (0, db_1.createReportWithMl)(user.id);
            const res = await (0, api_1.api)(app_1.default)
                .get("/api/report/report")
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data).toHaveLength(1);
        });
    });
    (0, vitest_1.describe)("GET /api/report/report/:id", () => {
        (0, vitest_1.it)("returns report by id", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const { report } = await (0, db_1.createReportWithMl)(user.id);
            const res = await (0, api_1.api)(app_1.default)
                .get(`/api/report/report/${report.id}`)
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data.id).toBe(report.id);
        });
    });
    (0, vitest_1.describe)("PUT /api/report/update/:id", () => {
        (0, vitest_1.it)("updates report fields", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const { report } = await (0, db_1.createReportWithMl)(user.id);
            const res = await (0, api_1.api)(app_1.default)
                .put(`/api/report/update/${report.id}`)
                .set((0, api_1.authHeader)(token))
                .send({ city: "Bandung" });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.data.updated.city).toBe("Bandung");
        });
    });
    (0, vitest_1.describe)("PATCH /api/report/patch/:id", () => {
        (0, vitest_1.it)("returns 403 for non-admin user", async () => {
            const { user, token } = await (0, db_1.loginAsUser)({ role: "user" });
            const { report } = await (0, db_1.createReportWithMl)(user.id);
            const res = await (0, api_1.api)(app_1.default)
                .patch(`/api/report/patch/${report.id}`)
                .set((0, api_1.authHeader)(token))
                .send({ reportStatus: "done" });
            (0, vitest_1.expect)(res.status).toBe(403);
        });
        (0, vitest_1.it)("allows admin to update report status", async () => {
            const admin = await (0, db_1.createUser)({
                email: "admin@example.com",
                role: "admin",
            });
            const { report } = await (0, db_1.createReportWithMl)(admin.id);
            const { token } = await (0, db_1.loginAsExistingUser)(admin);
            const res = await (0, api_1.api)(app_1.default)
                .patch(`/api/report/patch/${report.id}`)
                .set((0, api_1.authHeader)(token))
                .send({ reportStatus: "done" });
            (0, vitest_1.expect)(res.status).toBe(203);
            (0, vitest_1.expect)(res.body.data.status.reportStatus).toBe("done");
        });
    });
    (0, vitest_1.describe)("DELETE /api/report/delete/:id", () => {
        (0, vitest_1.it)("returns 400 when report status is not done", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const { report } = await (0, db_1.createReportWithMl)(user.id);
            const res = await (0, api_1.api)(app_1.default)
                .delete(`/api/report/delete/${report.id}`)
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("deletes report when status is done", async () => {
            const { user, token } = await (0, db_1.loginAsUser)();
            const { report } = await (0, db_1.createReportWithMl)(user.id);
            await prisma_1.default.report.update({
                where: { id: report.id },
                data: { reportStatus: "done" },
            });
            const res = await (0, api_1.api)(app_1.default)
                .delete(`/api/report/delete/${report.id}`)
                .set((0, api_1.authHeader)(token));
            (0, vitest_1.expect)(res.status).toBe(203);
            const deleted = await prisma_1.default.report.findUnique({
                where: { id: report.id },
            });
            (0, vitest_1.expect)(deleted).toBeNull();
        });
    });
});
