import { describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import { api, authHeader } from "@/test/helpers/api";
import {
  createReportWithMl,
  createUser,
  loginAsExistingUser,
  loginAsUser,
} from "@/test/helpers/db";

const boundingBoxes = [
  { x: 10, y: 20, width: 40, height: 30, label: "berlubang" },
];

describe("POST /api/report/manual-label/:id", () => {
  it("returns 401 without bearer token", async () => {
    const res = await api(app)
      .post("/api/report/manual-label/any-id")
      .send({ boundingBoxes });

    expect(res.status).toBe(401);
  });

  it("returns 400 when boundingBoxes is empty", async () => {
    const { token } = await loginAsUser();

    const res = await api(app)
      .post("/api/report/manual-label/fake-id")
      .set(authHeader(token))
      .send({ boundingBoxes: [] });

    expect(res.status).toBe(400);
  });

  it("returns 404 when report does not exist", async () => {
    const { token } = await loginAsUser();

    const res = await api(app)
      .post("/api/report/manual-label/00000000-0000-0000-0000-000000000000")
      .set(authHeader(token))
      .send({ boundingBoxes });

    expect(res.status).toBe(404);
  });

  it("returns 403 when user is not report owner", async () => {
    const owner = await createUser({ email: "owner@example.com" });
    const { report } = await createReportWithMl(owner.id, {
      isDetected: false,
    });
    const { token } = await loginAsUser({ email: "other@example.com" });

    const res = await api(app)
      .post(`/api/report/manual-label/${report.id}`)
      .set(authHeader(token))
      .send({ boundingBoxes });

    expect(res.status).toBe(403);
  });

  it("returns 409 when ML already detected for regular user", async () => {
    const { user, token } = await loginAsUser();
    const { report } = await createReportWithMl(user.id, {
      isDetected: true,
    });

    const res = await api(app)
      .post(`/api/report/manual-label/${report.id}`)
      .set(authHeader(token))
      .send({ boundingBoxes });

    expect(res.status).toBe(409);
  });

  it("saves manual labels when ML did not detect", async () => {
    const { user, token } = await loginAsUser();
    const { report, mlResult } = await createReportWithMl(user.id, {
      isDetected: false,
    });

    const res = await api(app)
      .post(`/api/report/manual-label/${report.id}`)
      .set(authHeader(token))
      .send({ boundingBoxes, confidenceScore: 1 });

    expect(res.status).toBe(200);
    expect(res.body.data.mlResult.is_Detected).toBe(true);
    expect(res.body.data.mlResult.model_version).toBe("manual-v1.0.0");
    expect(res.body.data.mlResult.boundingbox).toHaveLength(1);

    const updated = await prisma.mlResult.findUnique({
      where: { id: mlResult.id },
      include: { boundingbox: true },
    });
    expect(updated?.is_Detected).toBe(true);
    expect(updated?.boundingbox[0].label).toBe("berlubang");
  });

  it("allows admin to relabel even when already detected", async () => {
    const owner = await createUser({ email: "owner2@example.com" });
    const { report } = await createReportWithMl(owner.id, {
      isDetected: true,
    });
    const admin = await createUser({
      email: "admin-label@example.com",
      role: "admin",
    });
    const { token } = await loginAsExistingUser(admin);

    const res = await api(app)
      .post(`/api/report/manual-label/${report.id}`)
      .set(authHeader(token))
      .send({ boundingBoxes });

    expect(res.status).toBe(200);
    expect(res.body.data.mlResult.is_Detected).toBe(true);
  });
});
