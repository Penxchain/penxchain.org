import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3002),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(64, "JWT_SECRET must be at least 64 chars"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_URLS: z.string().optional(),
  REDIS_URL: z.string().url().optional(),
  SUPER_ADMIN_ID: z.string().min(1, "SUPER_ADMIN_ID is required"),
  PASSWORD_PEPPER: z.string().min(32, "PASSWORD_PEPPER must be at least 32 chars"),
  RECAPTCHA_SECRET_KEY: z.string().optional(), // reCAPTCHA v3 secret key
  PENALTY_WINDOW_MINUTES: z.coerce.number().min(1).max(1440).default(30), // Referral penalty aggregation window
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
