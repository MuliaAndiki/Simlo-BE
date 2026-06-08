import dotenv from "dotenv";
import path from "path";

/** Dipakai di GitHub Actions / CI bila secret repo belum dikonfigurasi */
export const CI_INTERNAL_API_SECRET = "ci-test-internal-api-secret";

let loaded = false;

function isCiEnvironment(): boolean {
  return process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
}

function ensureTestEnvDefaults(): void {
  if (!process.env.INTERNAL_API_SECRET && isCiEnvironment()) {
    process.env.INTERNAL_API_SECRET = CI_INTERNAL_API_SECRET;
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "ci-test-secret";
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
  }
}

export function loadTestEnv(): void {
  if (loaded) {
    ensureTestEnvDefaults();
    return;
  }

  dotenv.config({ path: path.resolve(process.cwd(), ".env") });

  process.env.NODE_ENV = "test";
  process.env.TF_CPP_MIN_LOG_LEVEL = process.env.TF_CPP_MIN_LOG_LEVEL ?? "2";
  process.env.TF_ENABLE_ONEDNN_OPTS = process.env.TF_ENABLE_ONEDNN_OPTS ?? "0";

  ensureTestEnvDefaults();

  loaded = true;
}

export function getInternalApiSecret(): string {
  loadTestEnv();

  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    throw new Error(
      "INTERNAL_API_SECRET is not set. Add it to .env (lokal) atau set di GitHub Actions env.",
    );
  }
  return secret;
}
