"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveUser = requireActiveUser;
const db_1 = require("./database/db");
const errors_1 = require("./errors");
async function requireActiveUser(request, reply) {
    try {
        const jwtUser = request.user;
        if (!jwtUser?.id) {
            throw new errors_1.UnauthorizedError();
        }
        const user = await db_1.db.user.findFirst({
            where: { id: jwtUser.id },
            select: { isBanned: true, banReason: true },
        });
        if (!user) {
            throw new errors_1.UnauthorizedError("User not found");
        }
        if (user.isBanned) {
            const reason = user.banReason || "Account suspended";
            throw new errors_1.ForbiddenError(`Account banned: ${reason}. Contact support@penxchain.com if you believe this is an error.`);
        }
    }
    catch (err) {
        if (err instanceof errors_1.ForbiddenError || err instanceof errors_1.UnauthorizedError) {
            throw err;
        }
        console.error("[MIDDLEWARE] Error in requireActiveUser:", err);
        throw new errors_1.UnauthorizedError();
    }
}
//# sourceMappingURL=middleware.js.map