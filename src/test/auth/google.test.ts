import "@/test/mocks/google-auth";
import { mockVerifyIdToken } from "@/test/mocks/google-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "@/app";
import prisma from "@/lib/prisma";
import { api, authHeader } from "@/test/helpers/api";
import { API_KEY, GOOGLE_CLIENT_ID } from "@/test/helpers/constants";
import { createUser } from "@/test/helpers/db";

const googlePayload = {
  email: "google.user@example.com",
  name: "Google User",
  picture: "https://lh3.googleusercontent.com/a/photo.jpg",
};

function mockGoogleTicket(payload: Record<string, string> | null) {
  mockVerifyIdToken.mockResolvedValueOnce({
    getPayload: () => payload,
  });
}

describe("POST /api/auth/google", () => {
  beforeEach(() => {
    mockVerifyIdToken.mockReset();
  });

  it("returns 401 when internal API key is missing", async () => {
    const res = await api(app)
      .raw.post("/api/auth/google")
      .send({ token: "fake-token" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Missing internal API key/i);
  });

  it("returns 403 when internal API key is invalid", async () => {
    const res = await api(app)
      .raw.post("/api/auth/google")
      .set("x-internal-api-key", "wrong-key")
      .send({ token: "fake-token" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Invalid internal API key/i);
  });

  it("returns 400 when Google ticket payload is empty", async () => {
    mockGoogleTicket(null);

    const res = await api(app)
      .post("/api/auth/google")
      .send({ token: "valid-looking-token" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no payload/i);
    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: "valid-looking-token",
      audience: GOOGLE_CLIENT_ID,
    });
  });

  it("returns 500 when Google token verification fails", async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));

    const res = await api(app)
      .post("/api/auth/google")
      .send({ token: "invalid-token" });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/service internal error/i);
  });

  it("creates a new user when email is not registered", async () => {
    mockGoogleTicket(googlePayload);

    const res = await api(app)
      .post("/api/auth/google")
      .send({ token: "new-user-token" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/successfully login with google/i);
    expect(res.body.data.user.email).toBe(googlePayload.email);
    expect(res.body.data.user.name).toBe(googlePayload.name);
    expect(res.body.data.tokens).toBeUndefined();

    const stored = await prisma.user.findFirst({
      where: { email: googlePayload.email },
    });
    expect(stored).not.toBeNull();
    expect(stored?.role).toBe("user");
  });

  it("returns JWT and session for an existing user", async () => {
    const existing = await createUser({
      email: googlePayload.email,
      name: "Old Name",
      picture: "https://example.com/old.png",
    });

    await prisma.userSession.create({
      data: {
        userID: existing.id,
        userAgent: "old-agent",
        expires_at: new Date(Date.now() + 60_000),
        ipAddres: "10.0.0.1",
      },
    });

    mockGoogleTicket(googlePayload);

    const res = await api(app)
      .post("/api/auth/google")
      .send({ token: "existing-user-token" });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens).toBeTypeOf("string");
    expect(res.body.data.user.email).toBe(googlePayload.email);

    const sessions = await prisma.userSession.findMany({
      where: { userID: existing.id },
    });
    expect(sessions).toHaveLength(1);
    expect(sessions[0].userAgent).not.toBe("old-agent");

    const updatedUser = await prisma.user.findUnique({
      where: { id: existing.id },
    });
    expect(updatedUser?.picture).toBe(googlePayload.picture);
    expect(updatedUser?.name).toBe(googlePayload.name);
  });

  it("returns 400 from controller when service returns null ticket", async () => {
    mockVerifyIdToken.mockResolvedValueOnce(null);

    const res = await api(app)
      .post("/api/auth/google")
      .send({ token: "null-ticket-token" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/bad request/i);
  });

  it("allows authenticated flow after existing user login", async () => {
    await createUser({ email: googlePayload.email });
    mockGoogleTicket(googlePayload);

    const loginRes = await api(app)
      .post("/api/auth/google")
      .send({ token: "session-token" });

    const token = loginRes.body.data.tokens as string;

    const meRes = await api(app).get("/api/auth/me").set(authHeader(token));

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(googlePayload.email);
  });

  it("rejects /api/auth/google when INTERNAL_API_SECRET env is unset", async () => {
    const original = process.env.INTERNAL_API_SECRET;
    delete process.env.INTERNAL_API_SECRET;

    const res = await api(app)
      .raw.post("/api/auth/google")
      .set("x-internal-api-key", API_KEY)
      .send({ token: "any" });

    process.env.INTERNAL_API_SECRET = original;

    expect(res.status).toBe(500);
  });
});
