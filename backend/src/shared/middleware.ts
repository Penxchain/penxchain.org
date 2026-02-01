
import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "./database/db";
import { ForbiddenError, UnauthorizedError } from "./errors";

export async function requireActiveUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Ensure we have a user from JWT (usually populated by request.jwtVerify() before this)
    const jwtUser = request.user as { id: string } | undefined;

    if (!jwtUser?.id) {
       // If no user is attached, we can't check status. 
       // Depending on where this is used, it might be fine (public routes) or not.
       // Assuming this middleware is used AFTER auth/verifyJwt
       throw new UnauthorizedError();
    }

    const user = await db.user.findFirst({
      where: { id: jwtUser.id },
      select: { isBanned: true },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.isBanned) {
      throw new ForbiddenError("Account suspended");
    }
  } catch (err) {
    if (err instanceof ForbiddenError || err instanceof UnauthorizedError) {
      throw err;
    }
    // Log internal error but don't crash
    console.error("[MIDDLEWARE] Error in requireActiveUser:", err);
    throw new UnauthorizedError(); 
  }
}
