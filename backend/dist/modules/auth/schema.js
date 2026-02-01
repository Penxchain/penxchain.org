"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    walletAddress: zod_1.default.string().min(10, 'Invalid wallet address').optional(),
    username: zod_1.default.string().min(3).optional(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    referralCode: zod_1.default.string().optional(),
});
exports.loginSchema = zod_1.default.object({
    walletAddress: zod_1.default.string().min(10).optional(),
    email: zod_1.default.string().email().optional(),
    password: zod_1.default.string().optional(),
    signature: zod_1.default.string().optional(),
});
//# sourceMappingURL=schema.js.map