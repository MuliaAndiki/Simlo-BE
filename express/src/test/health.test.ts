import { describe, expect, it } from "vitest";
import app from "@/app";
import { api } from "@/test/helpers/api";

describe("GET /", () => {
  it("returns API health without internal API key", async () => {
    const res = await api(app).raw.get("/");

    expect(res.status).toBe(401);
  });

  it("returns API health with valid internal API key", async () => {
    const res = await api(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Simlo API!");
    expect(res.body.timestamp).toBeTypeOf("string");
  });
});
