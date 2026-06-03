import { getInternalApiSecret } from "@/test/load-env";

export function getApiKey(): string {
  return getInternalApiSecret();
}

export const JWT_SECRET = process.env.JWT_SECRET ?? "ci-test-secret";
export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ?? "test-google-client-id";
