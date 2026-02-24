"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const logger_1 = require("./shared/logger");
const error_handler_1 = require("./shared/error-handler");
const env_1 = require("./config/env");
async function buildApp() {
    const app = (0, fastify_1.default)({
        loggerInstance: logger_1.logger,
        disableRequestLogging: true,
    }).withTypeProvider();
    app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    await app.register(helmet_1.default, { global: true });
    await app.register(Promise.resolve().then(() => __importStar(require('@fastify/rate-limit'))), {
        max: 100,
        timeWindow: '1 minute',
    });
    const allowedOrigins = new Set([
        env_1.env.FRONTEND_URL,
        ...(env_1.env.FRONTEND_URLS ? env_1.env.FRONTEND_URLS.split(',') : []),
    ]
        .map((origin) => origin.trim())
        .filter(Boolean));
    const allowAllOrigins = allowedOrigins.has('*');
    await app.register(cors_1.default, {
        origin: (origin, callback) => {
            if (allowAllOrigins) {
                callback(null, true);
                return;
            }
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.has(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Not allowed'), false);
        },
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
        exposedHeaders: ['Content-Type', 'Authorization'],
    });
    await app.register(Promise.resolve().then(() => __importStar(require('@fastify/jwt'))), {
        secret: env_1.env.JWT_SECRET,
    });
    app.setErrorHandler(error_handler_1.errorHandler);
    app.register(async (instance) => {
        const { authRoutes } = await Promise.resolve().then(() => __importStar(require('./modules/auth/routes')));
        authRoutes(instance);
    }, { prefix: '/auth' });
    app.register(async (instance) => {
        const { waitlistRoutes } = await Promise.resolve().then(() => __importStar(require('./modules/waitlist/routes')));
        waitlistRoutes(instance);
    }, { prefix: '/waitlist' });
    app.register(async (instance) => {
        const { leaderboardRoutes } = await Promise.resolve().then(() => __importStar(require('./modules/leaderboard/routes')));
        leaderboardRoutes(instance);
    }, { prefix: '/leaderboard' });
    app.register(async (instance) => {
        const { adminRoutes } = await Promise.resolve().then(() => __importStar(require('./modules/admin/routes')));
        adminRoutes(instance);
    }, { prefix: '/admin' });
    app.get('/', async () => ({
        status: 'operational',
        service: 'Penxchain API',
        version: '1.0.0',
        documentation: '/docs',
        timestamp: new Date().toISOString()
    }));
    app.get('/health', async () => ({
        status: 'ok',
        timestamp: new Date(),
    }));
    return app;
}
//# sourceMappingURL=app.js.map