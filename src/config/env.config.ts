import { z } from "zod";
const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  PORT: z.number(),
  INTERNAL_API_SECRET: z.string(),
});
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(" Invalid Env Variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
