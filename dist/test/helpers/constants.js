"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_CLIENT_ID = exports.JWT_SECRET = exports.API_KEY = void 0;
exports.API_KEY = process.env.INTERNAL_API_SECRET ?? "ci-test-api-key";
exports.JWT_SECRET = process.env.JWT_SECRET ?? "ci-test-secret";
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "test-google-client-id";
