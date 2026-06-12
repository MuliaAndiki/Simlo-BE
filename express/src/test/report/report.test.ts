import "@/test/mocks/models-service";
import { mockGetPrediction } from "@/test/mocks/models-service";
import { beforeEach, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import { api, authHeader } from "@/test/helpers/api";
import {
  createReportWithMl,
  createUser,
  loginAsExistingUser,
  loginAsUser,
} from "@/test/helpers/db";

const reportBody = {
  city: "Jakarta",
  address_detail: "Jl. Sudirman",
  image_url: "https://example.com/report.jpg",
  latitude: -6.2,
  longitude: 106.816666,
  reportStatus: "isPending",
};

describe("Report API", () => {
  beforeEach(() => {
    mockGetPrediction.mockResolvedValue({
      is_Detected: false,
      confidenceScore: 0.2,
      model_version: "v1.0.0",
      processed_at: new Date(),
      boundingBoxes: [],
    });
  });

  describe("POST /api/report/created", () => {
    it("returns 401 without bearer token", async () => {
      const res = await api(app).post("/api/report/created").send(reportBody);

      expect(res.status).toBe(401);
    });

    it("creates report and ML result", async () => {
      const { token } = await loginAsUser();

      const res = await api(app)
        .post("/api/report/created")
        .set(authHeader(token))
        .send(reportBody);

      expect(res.status).toBe(201);
      expect(res.body.data.createed.city).toBe("Jakarta");
      expect(res.body.data.resultModels.is_Detected).toBe(false);
      expect(mockGetPrediction).toHaveBeenCalled();
    });
  });

  describe("GET /api/report", () => {
    it("returns all reports", async () => {
      const { user, token } = await loginAsUser();
      await createReportWithMl(user.id);

      const res = await api(app).get("/api/report").set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe("GET /api/report/:id", () => {
    it("returns report by id", async () => {
      const { user, token } = await loginAsUser();
      const { report } = await createReportWithMl(user.id);

      const res = await api(app)
        .get(`/api/report/${report.id}`)
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(report.id);
    });
  });

  describe("PUT /api/report/update/:id", () => {
    it("updates report fields", async () => {
      const { user, token } = await loginAsUser();
      const { report } = await createReportWithMl(user.id);

      const res = await api(app)
        .put(`/api/report/update/${report.id}`)
        .set(authHeader(token))
        .send({ city: "Bandung" });

      expect(res.status).toBe(200);
      expect(res.body.data.updated.city).toBe("Bandung");
    });
  });

  describe("PATCH /api/report/patch/:id", () => {
    it("returns 403 for non-admin user", async () => {
      const { user, token } = await loginAsUser({ role: "user" });
      const { report } = await createReportWithMl(user.id);

      const res = await api(app)
        .patch(`/api/report/patch/${report.id}`)
        .set(authHeader(token))
        .send({ reportStatus: "done" });

      expect(res.status).toBe(403);
    });

    it("allows admin to update report status", async () => {
      const admin = await createUser({
        email: "admin@example.com",
        role: "admin",
      });
      const { report } = await createReportWithMl(admin.id);
      const { token } = await loginAsExistingUser(admin);

      const res = await api(app)
        .patch(`/api/report/patch/${report.id}`)
        .set(authHeader(token))
        .send({ reportStatus: "done" });

      expect(res.status).toBe(203);
      expect(res.body.data.status.reportStatus).toBe("done");
    });
  });
});
