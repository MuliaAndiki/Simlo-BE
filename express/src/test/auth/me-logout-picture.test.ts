import { describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import { api, authHeader } from "@/test/helpers/api";
import { loginAsUser } from "@/test/helpers/db";

describe("Auth protected endpoints", () => {
  describe("GET /api/auth/me", () => {
    it("returns 401 without bearer token", async () => {
      const res = await api(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns 403 with invalid bearer token", async () => {
      const res = await api(app)
        .get("/api/auth/me")
        .set(authHeader("not-a-valid-jwt"));

      expect(res.status).toBe(403);
    });

    it("returns current user profile", async () => {
      const { user, token } = await loginAsUser({
        email: "me@example.com",
      });

      const res = await api(app).get("/api/auth/me").set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.email).toBe("me@example.com");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("returns 401 without bearer token", async () => {
      const res = await api(app).post("/api/auth/logout");
      expect(res.status).toBe(401);
    });

    it("deletes all sessions for the user", async () => {
      const { user, token } = await loginAsUser();

      const res = await api(app)
        .post("/api/auth/logout")
        .set(authHeader(token));

      expect(res.status).toBe(200);

      const sessions = await prisma.userSession.findMany({
        where: { userID: user.id },
      });
      expect(sessions).toHaveLength(0);
    });
  });

  describe("PATCH /api/auth/picture", () => {
    it("returns 401 without bearer token", async () => {
      const res = await api(app)
        .patch("/api/auth/picture")
        .send({ picture: "https://example.com/new.png" });

      expect(res.status).toBe(401);
    });

    it("updates user picture", async () => {
      const { user, token } = await loginAsUser();
      const newPicture = "https://example.com/updated.png";

      const res = await api(app)
        .patch("/api/auth/picture")
        .set(authHeader(token))
        .send({ picture: newPicture });

      expect(res.status).toBe(200);
      expect(res.body.data.patch.picture).toBe(newPicture);

      const updated = await prisma.user.findUnique({ where: { id: user.id } });
      expect(updated?.picture).toBe(newPicture);
    });
  });
});
