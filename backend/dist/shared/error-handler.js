"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(error, request, reply) {
    const { code, name, message, validation } = error;
    request.log.error({ err: error }, 'Request failed');
    if (error instanceof zod_1.ZodError) {
        return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation Error',
            details: error.flatten(),
        });
    }
    if (validation) {
        return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: message,
            details: validation,
        });
    }
    return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
    });
}
//# sourceMappingURL=error-handler.js.map