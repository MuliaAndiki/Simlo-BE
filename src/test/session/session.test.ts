import { describe, expect, it } from "vitest";
import app from "@/app";
import { api, authHeader } from "@/test/helpers/api";
import { loginAsUser } from "@/test/helpers/db";

describe("Session API", () => {
  describe("GET /api/session/current", () => {
    it("returns 401 without bearer token", async () => {
      const res = await api(app).get("/api/session/current");
      expect(res.status).toBe(401);
    });

    it("returns current session for authenticated user", async () => {
      const { session, token } = await loginAsUser();

      const res = await api(app)
        .get("/api/session/current")
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.current.id).toBe(session.id);
    });
  });

  describe("GET /api/session/allCurent", () => {
    it("returns all sessions for the user", async () => {
      const { user, token } = await loginAsUser();

      const res = await api(app)
        .get("/api/session/allCurent")
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].userID).toBe(user.id);
    });
  });
});
