import { describe, expect, it } from "vitest";
import app from "@/app";
import { api } from "@/test/helpers/api";
import { createUser } from "@/test/helpers/db";

describe("POST /api/auth/developer", () => {
  it("returns 404 when email is missing", async () => {
    const res = await api(app).post("/api/auth/developer").send({});

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/body not found/i);
  });

  it("returns 404 when email is not registered", async () => {
    const res = await api(app)
      .post("/api/auth/developer")
      .send({ email: "unknown@example.com" });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/email not registered/i);
  });

  it("returns JWT for a registered developer user", async () => {
    await createUser({
      email: "dev@example.com",
      role: "admin",
    });

    const res = await api(app)
      .post("/api/auth/developer")
      .send({ email: "dev@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens).toBeTypeOf("string");
  });
});
