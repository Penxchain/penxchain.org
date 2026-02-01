import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../shared/database/db";
import { env } from "../../config/env";

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
    const jwtUser = request.user as { id: string };

    // Check database to ensure we have the latest role (in case it was promoted after login)
    const user = await db.user.findFirst({
      where: { id: jwtUser.id },
      select: { id: true, role: true, isBanned: true },
    });

    // Check against DB role OR environment Super Admin ID (Universal Bypass)
    const isSuperAdmin =
      env.SUPER_ADMIN_ID && jwtUser.id === env.SUPER_ADMIN_ID;

    // Security: Check ban status
    if (user?.isBanned) {
        return reply.status(403).send({ message: "Account suspended" });
    }

    if (
      !user ||
      (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && !isSuperAdmin)
    ) {
      return reply
        .status(403)
        .send({ message: "Forbidden: Admin access required" });
    }
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

export async function requireSuperAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
    const jwtUser = request.user as { id: string };

    // Check DB role for SUPERADMIN
    const user = await db.user.findFirst({
      where: { id: jwtUser.id },
      select: { role: true, isBanned: true },
    });

    const isEnvSuperAdmin =
      env.SUPER_ADMIN_ID && jwtUser.id === env.SUPER_ADMIN_ID;

    if (user?.isBanned) {
       return reply.status(403).send({ message: "Account suspended" });
    }

    if (!isEnvSuperAdmin && user?.role !== "SUPERADMIN") {
      return reply
        .status(403)
        .send({ message: "Forbidden: Super Admin access required" });
    }
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
