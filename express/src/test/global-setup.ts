import { execSync } from "child_process";
import { loadTestEnv } from "./load-env";

export default async function globalSetup() {
  loadTestEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for integration tests");
  }

  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: process.env,
  });
}
