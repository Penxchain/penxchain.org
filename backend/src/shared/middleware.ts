
import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "./database/db";
import { ForbiddenError, UnauthorizedError, AccountLockedError } from "./errors";
import { lazySettleIfDue } from "../modules/admin/penalty.service";

export async function requireActiveUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Ensure we have a user from JWT (usually populated by request.jwtVerify() before this)
    const jwtUser = request.user as { id: string; tokenVersion?: number } | undefined;

    if (!jwtUser?.id || !Number.isInteger(jwtUser.tokenVersion)) {
       // If no user is attached, we can't check status. 
       // Assuming this middleware is used AFTER auth/verifyJwt
       throw new UnauthorizedError("Session invalidated. Please log in again.");
    }

    const user = await db.user.findFirst({
      where: { id: jwtUser.id },
      select: {
        isBanned: true,
        banReason: true,
        accountStatus: true,
        reviewEndsAt: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Token version check — kill stale sessions (Fix #3 session invalidation)
    if (user.tokenVersion !== jwtUser.tokenVersion) {
      throw new UnauthorizedError("Session invalidated. Please log in again.");
    }

    // Ban check (hard block)
    if (user.isBanned || user.accountStatus === "BANNED") {
      const reason = user.banReason || "Account suspended";
      throw new ForbiddenError(`Account banned: ${reason}. Contact support@penxchain.org if you believe this is an error.`);
    }

    // UNDER_REVIEW check — try lazy settlement if window expired
    if (user.accountStatus === "UNDER_REVIEW") {
      if (user.reviewEndsAt && new Date() >= user.reviewEndsAt) {
        // Window expired — attempt lazy settlement
        const settled = await lazySettleIfDue(jwtUser.id);
        if (!settled) {
          throw new AccountLockedError(user.reviewEndsAt);
        }
        // Settlement succeeded — user is now ACTIVE, proceed normally
      } else {
        // Still within review window — block access
        throw new AccountLockedError(user.reviewEndsAt);
      }
    }
  } catch (err) {
    if (err instanceof ForbiddenError || err instanceof UnauthorizedError || err instanceof AccountLockedError) {
      throw err;
    }
    // Log internal error but don't crash
    console.error("[MIDDLEWARE] Error in requireActiveUser:", err);
    throw new UnauthorizedError(); 
  }
}

