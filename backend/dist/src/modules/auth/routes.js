"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = __importDefault(require("zod"));
const controller_1 = require("./controller");
const schema_1 = require("./schema");
async function authRoutes(app) {
    const server = app.withTypeProvider();
    server.post('/signup', {
        schema: {
            body: schema_1.signupSchema,
            tags: ['Auth'],
            summary: 'Register a new user',
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.signupHandler);
    server.post('/login', {
        schema: {
            body: schema_1.loginSchema,
            tags: ['Auth'],
            summary: 'Login user',
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.loginHandler);
    server.get('/check-referral', {
        schema: {
            querystring: schema_1.checkReferralSchema,
            tags: ['Auth'],
            summary: 'Check if referral code is valid',
        },
    }, controller_1.checkReferralHandler);
}
//# sourceMappingURL=routes.js.map