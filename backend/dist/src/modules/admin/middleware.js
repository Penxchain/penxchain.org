"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
exports.requireSuperAdmin = requireSuperAdmin;
const db_1 = require("../../shared/database/db");
const env_1 = require("../../config/env");
async function requireAdmin(request, reply) {
    try {
        await request.jwtVerify();
        const jwtUser = request.user;
        const user = await db_1.db.user.findFirst({
            where: { id: jwtUser.id },
            select: { id: true, role: true, isBanned: true },
        });
        const isSuperAdmin = env_1.env.SUPER_ADMIN_ID && jwtUser.id === env_1.env.SUPER_ADMIN_ID;
        if (user?.isBanned) {
            return reply.status(403).send({ message: "Account suspended" });
        }
        if (!user ||
            (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && !isSuperAdmin)) {
            return reply
                .status(403)
                .send({ message: "Forbidden: Admin access required" });
        }
    }
    catch (err) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}
async function requireSuperAdmin(request, reply) {
    try {
        await request.jwtVerify();
        const jwtUser = request.user;
        const user = await db_1.db.user.findFirst({
            where: { id: jwtUser.id },
            select: { role: true, isBanned: true },
        });
        const isEnvSuperAdmin = env_1.env.SUPER_ADMIN_ID && jwtUser.id === env_1.env.SUPER_ADMIN_ID;
        if (user?.isBanned) {
            return reply.status(403).send({ message: "Account suspended" });
        }
        if (!isEnvSuperAdmin && user?.role !== "SUPERADMIN") {
            return reply
                .status(403)
                .send({ message: "Forbidden: Super Admin access required" });
        }
    }
    catch (err) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}
//# sourceMappingURL=middleware.js.map