"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimBonusSchema = exports.getTasksQuerySchema = exports.completeTaskSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.completeTaskSchema = zod_1.default.object({
    taskId: zod_1.default.string().uuid(),
    proof: zod_1.default.string().optional(),
});
exports.getTasksQuerySchema = zod_1.default.object({});
exports.claimBonusSchema = zod_1.default.object({});
//# sourceMappingURL=schema.js.map