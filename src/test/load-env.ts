import dotenv from "dotenv";
import path from "path";

let loaded = false;

export function loadTestEnv() {
  if (loaded) {
    return;
  }

  dotenv.config({ path: path.resolve(process.cwd(), ".env") });

  process.env.NODE_ENV = "test";
  process.env.TF_CPP_MIN_LOG_LEVEL = process.env.TF_CPP_MIN_LOG_LEVEL ?? "2";
  process.env.TF_ENABLE_ONEDNN_OPTS = process.env.TF_ENABLE_ONEDNN_OPTS ?? "0";

  loaded = true;
}

export function getInternalApiSecret(): string {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    throw new Error(
      "INTERNAL_API_SECRET is not set. Add it to .env or export it before running tests.",
    );
  }
  return secret;
}
