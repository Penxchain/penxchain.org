"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPxpSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.querySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.querySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().default(1),
    limit: zod_1.default.coerce.number().default(20),
    search: zod_1.default.string().optional(),
});
exports.createTaskSchema = zod_1.default.object({
    title: zod_1.default.string().min(3),
    description: zod_1.default.string().min(10),
    type: zod_1.default.enum(['SOCIAL', 'DAILY', 'ONE_TIME']),
    points: zod_1.default.number().int().positive(),
    link: zod_1.default.string().url().optional().or(zod_1.default.literal('')),
    icon: zod_1.default.string().optional(),
    category: zod_1.default.string().optional().default('engagement'),
    validationKey: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional().default(true),
    durationDays: zod_1.default.number().int().min(1).max(30).optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
exports.updateUserPxpSchema = zod_1.default.object({
    amount: zod_1.default.number().int().positive(),
    action: zod_1.default.enum(['add', 'subtract', 'set']),
});
//# sourceMappingURL=schema.js.map