"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const errors_1 = require("./errors");
const GENERIC_MESSAGES = {
    SERVER: "We're experiencing technical difficulties. Please try again shortly.",
    AUTH: "Unable to authenticate. Please try again.",
    VALIDATION: "Please check your input and try again.",
    NETWORK: "Connection issue. Please check your network and try again.",
};
function errorHandler(error, request, reply) {
    request.log.error({
        err: {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack,
        },
        request: {
            method: request.method,
            url: request.url,
            ...(process.env.NODE_ENV === 'development' && { body: request.body }),
        },
    }, 'Request error');
    if (error instanceof errors_1.AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            message: error.message,
        });
    }
    if (error instanceof zod_1.ZodError) {
        const issues = error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return reply.status(400).send({
            success: false,
            message: GENERIC_MESSAGES.VALIDATION,
            details: issues,
        });
    }
    if (error.validation) {
        return reply.status(400).send({
            success: false,
            message: GENERIC_MESSAGES.VALIDATION,
            details: error.validation.map((v) => ({
                field: v.instancePath?.replace(/^\//, '') || v.params?.missingProperty || 'input',
                message: v.message || 'Invalid value',
            })),
        });
    }
    if (error.name === 'PrismaClientKnownRequestError' ||
        error.name === 'PrismaClientUnknownRequestError' ||
        error.name === 'PrismaClientRustPanicError' ||
        error.name === 'PrismaClientInitializationError' ||
        error.name === 'PrismaClientValidationError' ||
        error.message?.includes('prisma') ||
        error.message?.includes('database') ||
        error.message?.includes('supabase') ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes("Can't reach database")) {
        request.log.error({
            type: 'DATABASE_ERROR',
            originalMessage: error.message,
            code: error.code,
        }, 'Database operation failed');
        return reply.status(503).send({
            success: false,
            message: GENERIC_MESSAGES.SERVER,
        });
    }
    if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
        error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' ||
        error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
        error.message?.includes('jwt') ||
        error.message?.includes('token')) {
        return reply.status(401).send({
            success: false,
            message: GENERIC_MESSAGES.AUTH,
        });
    }
    if (error.statusCode === 429) {
        return reply.status(429).send({
            success: false,
            message: "Too many requests. Please slow down and try again.",
        });
    }
    return reply.status(500).send({
        success: false,
        message: GENERIC_MESSAGES.SERVER,
    });
}
//# sourceMappingURL=error-handler.js.map