"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockGetPrediction = void 0;
const vitest_1 = require("vitest");
exports.mockGetPrediction = vitest_1.vi.fn();
vitest_1.vi.mock("@/service/ModelsService", () => ({
    default: {
        GetPrediction: exports.mockGetPrediction,
    },
}));
