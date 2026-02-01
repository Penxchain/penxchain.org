import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './errors';

/**
 * Global Error Handler for Penxchain API
 * 
 * SECURITY PRINCIPLES:
 * 1. Internal errors stay internal - users never see file paths, DB info, or stack traces
 * 2. All errors are logged in full for debugging
 * 3. Users receive calm, human, actionable messages
 * 4. Known errors (AppError) return their safe message
 * 5. Unknown errors return a generic fallback message
 */

// Generic messages for different error categories
const GENERIC_MESSAGES = {
  SERVER: "We're experiencing technical difficulties. Please try again shortly.",
  AUTH: "Unable to authenticate. Please try again.",
  VALIDATION: "Please check your input and try again.",
  NETWORK: "Connection issue. Please check your network and try again.",
} as const;

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // 1. ALWAYS log the full error internally for debugging
  // This is safe because logs are only visible to engineers
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
      // Don't log body in production (may contain passwords)
      ...(process.env.NODE_ENV === 'development' && { body: request.body }),
    },
  }, 'Request error');

  // 2. Handle our custom AppError types (these are intentional, user-safe errors)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  // 3. Handle Zod Validation Errors (from schema validation)
  if (error instanceof ZodError) {
    // Flatten Zod errors to a simple list of field issues
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

  // 4. Handle Fastify's built-in validation errors
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: GENERIC_MESSAGES.VALIDATION,
      // Only show field names, not full error details
      details: error.validation.map((v: any) => ({
        field: v.instancePath?.replace(/^\//, '') || v.params?.missingProperty || 'input',
        message: v.message || 'Invalid value',
      })),
    });
  }

  // 5. Handle Prisma/Database errors (NEVER expose these to users)
  if (
    error.name === 'PrismaClientKnownRequestError' ||
    error.name === 'PrismaClientUnknownRequestError' ||
    error.name === 'PrismaClientRustPanicError' ||
    error.name === 'PrismaClientInitializationError' ||
    error.name === 'PrismaClientValidationError' ||
    error.message?.includes('prisma') ||
    error.message?.includes('database') ||
    error.message?.includes('supabase') ||
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes("Can't reach database")
  ) {
    // Extra logging for DB errors (they're critical)
    request.log.error({
      type: 'DATABASE_ERROR',
      originalMessage: error.message,
      code: (error as any).code,
    }, 'Database operation failed');

    return reply.status(503).send({
      success: false,
      message: GENERIC_MESSAGES.SERVER,
    });
  }

  // 6. Handle JWT/Auth errors
  if (
    error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
    error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' ||
    error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
    error.message?.includes('jwt') ||
    error.message?.includes('token')
  ) {
    return reply.status(401).send({
      success: false,
      message: GENERIC_MESSAGES.AUTH,
    });
  }

  // 7. Handle rate limiting errors
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      message: "Too many requests. Please slow down and try again.",
    });
  }

  // 8. Default fallback - NEVER expose the real error message
  // Only show generic message to user, full details are in logs
  return reply.status(500).send({
    success: false,
    message: GENERIC_MESSAGES.SERVER,
  });
}
