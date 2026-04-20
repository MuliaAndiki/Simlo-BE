"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
// initial env
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error(" Invalid Env Variables:", _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
