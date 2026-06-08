import { vi } from "vitest";

export const mockGetPrediction = vi.fn();

vi.mock("@/service/ModelsService", () => ({
  default: {
    GetPrediction: mockGetPrediction,
  },
}));
