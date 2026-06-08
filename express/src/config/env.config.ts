import { z } from "zod";
const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  PORT: z.coerce.number().default(5000),
  INTERNAL_API_SECRET: z.string(),
  ML_SERVICE_URL: z.string().default("http://localhost:8000"),
  ML_SERVICE_TIMEOUT_MS: z.coerce.number().default(30000),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(" Invalid Env Variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
