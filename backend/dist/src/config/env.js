"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3002),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(64, "JWT_SECRET must be at least 64 chars"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    FRONTEND_URL: zod_1.z.string().url().default("http://localhost:3000"),
    FRONTEND_URLS: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().url().optional(),
    SUPER_ADMIN_ID: zod_1.z.string().min(1, "SUPER_ADMIN_ID is required"),
    PASSWORD_PEPPER: zod_1.z.string().min(32, "PASSWORD_PEPPER must be at least 32 chars"),
    RECAPTCHA_SECRET_KEY: zod_1.z.string().optional(),
    PENALTY_WINDOW_MINUTES: zod_1.z.coerce.number().min(1).max(1440).default(30),
    ACCESS_TOKEN_TTL: zod_1.z.string().default("12h"),
    REFRESH_TOKEN_TTL_DAYS: zod_1.z.coerce.number().min(1).max(90).default(30),
    REFRESH_REVOKED_RETENTION_DAYS: zod_1.z.coerce.number().min(1).max(180).default(30),
    REFRESH_CLEANUP_INTERVAL_MINUTES: zod_1.z.coerce.number().min(5).max(1440).default(30),
    REFRESH_COOKIE_NAME: zod_1.z.string().default("penx_rt"),
    REFRESH_COOKIE_DOMAIN: zod_1.z.string().optional(),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(64).optional(),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map