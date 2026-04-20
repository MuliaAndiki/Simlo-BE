import { z } from "zod";
const envSchema = z.object({
  // initial env
});
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(" Invalid Env Variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
