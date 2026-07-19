import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default("v1"),
  MONGODB_URI: z.string().min(1),
  USE_MEMORY_DB: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  COOKIE_SECRET: z.string().min(32),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("SkillSwap <noreply@skillswap.app>"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@skillswap.app"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("Admin123!@#"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

export const allowedOrigins = Array.from(
  new Set([
    ...env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
    env.FRONTEND_URL.trim(),
  ])
);

function isOriginAllowed(origin: string): boolean {
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel preview/production URLs when frontend is hosted on Vercel
  if (
    isProduction &&
    env.FRONTEND_URL.includes("vercel.app") &&
    /^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)
  ) {
    return true;
  }

  return false;
}

export { isOriginAllowed };
