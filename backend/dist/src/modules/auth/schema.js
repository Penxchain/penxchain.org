"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReferralSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    walletAddress: zod_1.default.string().min(10, "Invalid wallet address").optional(),
    username: zod_1.default.string().min(3).optional(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    referralCode: zod_1.default.string().optional(),
    deviceId: zod_1.default.string().optional(),
    recaptchaToken: zod_1.default.string().optional(),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email().optional(),
    password: zod_1.default.string().optional(),
    walletAddress: zod_1.default.string().min(10).optional(),
    signature: zod_1.default.string().optional(),
    recaptchaToken: zod_1.default.string().optional(),
});
exports.checkReferralSchema = zod_1.default.object({
    code: zod_1.default.string().min(1),
});
//# sourceMappingURL=schema.js.map