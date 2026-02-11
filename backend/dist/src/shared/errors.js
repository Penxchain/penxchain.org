"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.InternalServerError = exports.TooManyRequestsError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.InvalidCredentialsError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
exports.wrapDatabaseOperation = wrapDatabaseOperation;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message = "Invalid request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InvalidCredentialsError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class ForbiddenError extends AppError {
    constructor(message = "You don't have permission to access this resource") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends AppError {
    constructor(message = "Too many requests. Please try again later.") {
        super(message, 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class InternalServerError extends AppError {
    constructor(message = "We're experiencing technical difficulties. Please try again shortly.") {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class ServiceUnavailableError extends AppError {
    constructor(message = "Service temporarily unavailable. Please try again in a few moments.") {
        super(message, 503);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
async function wrapDatabaseOperation(operation, context) {
    try {
        return await operation();
    }
    catch (error) {
        console.error(`[DB ERROR] ${context}:`, {
            message: error?.message,
            code: error?.code,
            ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
        });
        throw new InternalServerError();
    }
}
//# sourceMappingURL=errors.js.map