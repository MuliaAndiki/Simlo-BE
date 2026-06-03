import { afterAll, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import { loadTestEnv } from "./load-env";

loadTestEnv();

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
