"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPxpSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTaskSchema = zod_1.default.object({
    title: zod_1.default.string().min(3),
    description: zod_1.default.string().min(10),
    type: zod_1.default.enum(['SOCIAL', 'DAILY', 'ONE_TIME']),
    points: zod_1.default.number().int().positive(),
    link: zod_1.default.string().url().optional(),
    validationKey: zod_1.default.string().optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
exports.updateUserPxpSchema = zod_1.default.object({
    amount: zod_1.default.number().int().positive(),
    action: zod_1.default.enum(['add', 'subtract', 'set']),
});
//# sourceMappingURL=schema.js.map