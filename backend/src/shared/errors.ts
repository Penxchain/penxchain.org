/**
 * Custom Error Classes for Penxchain API
 * 
 * These error classes provide:
 * 1. Clean, user-safe error messages
 * 2. Proper HTTP status codes
 * 3. Separation between operational errors (expected) and programming errors (bugs)
 * 
 * GOLDEN RULE: Users never see internal details. Only calm, actionable messages.
 */

/**
 * Base application error class
 * All custom errors extend this to enable instanceof checks
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request - Invalid input, validation failures
 */
export class BadRequestError extends AppError {
  constructor(message = "Invalid request") {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

/**
 * 401 Invalid Credentials - Wrong password or user not found
 * Use distinct messages to help users understand the issue
 */
export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
  }
}

/**
 * 403 Forbidden - Authenticated but not allowed
 */
export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to access this resource") {
    super(message, 403);
  }
}

/**
 * 423 Locked - Account under review (referral penalty window)
 * Consistent message across login, middleware, and API with dynamic time remaining.
 */
export class AccountLockedError extends AppError {
  constructor(reviewEndsAt?: Date | null) {
    let timeMsg = "Please try again later.";
    if (reviewEndsAt) {
      const msLeft = new Date(reviewEndsAt).getTime() - Date.now();
      if (msLeft > 0) {
        const minsLeft = Math.ceil(msLeft / 60000);
        timeMsg = minsLeft > 1
          ? `Please try again in ${minsLeft} minutes.`
          : "Please try again in about a minute.";
      } else {
        timeMsg = "Your review period has ended. Please try logging in again.";
      }
    }
    super(`Your account is currently under review due to referral activity. ${timeMsg}`, 423);
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * 409 Conflict - Duplicate resource, already exists
 */
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429);
  }
}

/**
 * 500 Internal Server Error - Generic server error
 * 
 * IMPORTANT: The message passed here is what the USER sees.
 * Internal details should be logged separately, never in this message.
 */
export class InternalServerError extends AppError {
  constructor(message = "We're experiencing technical difficulties. Please try again shortly.") {
    super(message, 500);
  }
}

/**
 * 503 Service Unavailable - Temporary outage
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable. Please try again in a few moments.") {
    super(message, 503);
  }
}

/**
 * Helper function to wrap database operations safely
 * Catches any database errors and converts them to user-safe InternalServerError
 * 
 * @param operation - Async function that performs the database operation
 * @param context - Description of the operation for logging (e.g., "findUserByEmail")
 */
export async function wrapDatabaseOperation<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Log the full error internally for debugging
    console.error(`[DB ERROR] ${context}:`, {
      message: error?.message,
      code: error?.code,
      // Don't log full stack in production to avoid log bloat
      ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
    });

    // Throw a clean error for the user
    throw new InternalServerError();
  }
}
