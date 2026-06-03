import { execSync } from "child_process";
import { afterAll, beforeAll, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "ci-test-secret";
process.env.INTERNAL_API_SECRET =
  process.env.INTERNAL_API_SECRET ?? "ci-test-api-key";
process.env.GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ?? "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET ?? "test-google-client-secret";

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for integration tests");
  }

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: process.env,
  });
});

beforeEach(async () => {
  await prisma.boundingBox.deleteMany();
  await prisma.mlResult.deleteMany();
  await prisma.report.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
