import request, { Test } from "supertest";
import { Application } from "express";
import { API_KEY } from "./constants";

export function withApiKey(req: Test): Test {
  return req.set("x-internal-api-key", API_KEY);
}

export function api(app: Application) {
  return {
    get: (url: string) => withApiKey(request(app).get(url)),
    post: (url: string) => withApiKey(request(app).post(url)),
    put: (url: string) => withApiKey(request(app).put(url)),
    patch: (url: string) => withApiKey(request(app).patch(url)),
    delete: (url: string) => withApiKey(request(app).delete(url)),
    raw: request(app),
  };
}

export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
