"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.leaderboardQuerySchema = zod_1.default.object({
    limit: zod_1.default.coerce.number().min(1).max(100).default(50).optional(),
});
//# sourceMappingURL=schema.js.map