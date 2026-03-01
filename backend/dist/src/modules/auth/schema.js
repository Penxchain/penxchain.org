"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReferralSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    walletAddress: zod_1.default.string().trim().min(10, "Invalid wallet address").max(128).optional(),
    username: zod_1.default.string().trim().min(3).max(32).optional(),
    email: zod_1.default.string().trim().email().max(254),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters").max(128),
    referralCode: zod_1.default.string().trim().min(3).max(32).optional(),
    deviceId: zod_1.default.string().trim().min(8).max(128).optional(),
    recaptchaToken: zod_1.default.string().trim().min(10).max(4096).optional(),
});
exports.loginSchema = zod_1.default
    .object({
    identifier: zod_1.default.string().trim().min(3).max(254).optional(),
    email: zod_1.default.string().trim().email().max(254).optional(),
    password: zod_1.default.string().min(1).max(128).optional(),
    walletAddress: zod_1.default.string().trim().min(10).max(128).optional(),
    signature: zod_1.default.string().trim().min(10).max(2048).optional(),
    recaptchaToken: zod_1.default.string().trim().min(10).max(4096).optional(),
})
    .superRefine((data, ctx) => {
    const hasIdentifier = Boolean(data.identifier || data.email);
    const hasWalletFlow = Boolean(data.walletAddress || data.signature);
    if (!hasIdentifier && !hasWalletFlow) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: "identifier/email or wallet credentials are required",
        });
    }
    if (hasIdentifier && !data.password) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: "password is required for email/username login",
        });
    }
    if (!hasIdentifier && hasWalletFlow && !(data.walletAddress && data.signature)) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: "walletAddress and signature must be provided together",
        });
    }
});
exports.checkReferralSchema = zod_1.default.object({
    code: zod_1.default.string().trim().min(1).max(32),
});
//# sourceMappingURL=schema.js.map