"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockVerifyIdToken = void 0;
const vitest_1 = require("vitest");
exports.mockVerifyIdToken = vitest_1.vi.fn();
vitest_1.vi.mock("google-auth-library", () => ({
    OAuth2Client: vitest_1.vi.fn().mockImplementation(() => ({
        verifyIdToken: exports.mockVerifyIdToken,
    })),
}));
