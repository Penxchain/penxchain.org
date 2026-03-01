"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveUser = requireActiveUser;
const db_1 = require("./database/db");
const errors_1 = require("./errors");
const penalty_service_1 = require("../modules/admin/penalty.service");
async function requireActiveUser(request, reply) {
    try {
        const jwtUser = request.user;
        if (!jwtUser?.id || !Number.isInteger(jwtUser.tokenVersion)) {
            throw new errors_1.UnauthorizedError("Session invalidated. Please log in again.");
        }
        const user = await db_1.db.user.findFirst({
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
            throw new errors_1.UnauthorizedError("User not found");
        }
        if (user.tokenVersion !== jwtUser.tokenVersion) {
            throw new errors_1.UnauthorizedError("Session invalidated. Please log in again.");
        }
        if (user.isBanned || user.accountStatus === "BANNED") {
            const reason = user.banReason || "Account suspended";
            throw new errors_1.ForbiddenError(`Account banned: ${reason}. Contact support@penxchain.org if you believe this is an error.`);
        }
        if (user.accountStatus === "UNDER_REVIEW") {
            if (user.reviewEndsAt && new Date() >= user.reviewEndsAt) {
                const settled = await (0, penalty_service_1.lazySettleIfDue)(jwtUser.id);
                if (!settled) {
                    throw new errors_1.AccountLockedError(user.reviewEndsAt);
                }
            }
            else {
                throw new errors_1.AccountLockedError(user.reviewEndsAt);
            }
        }
    }
    catch (err) {
        if (err instanceof errors_1.ForbiddenError || err instanceof errors_1.UnauthorizedError || err instanceof errors_1.AccountLockedError) {
            throw err;
        }
        console.error("[MIDDLEWARE] Error in requireActiveUser:", err);
        throw new errors_1.UnauthorizedError();
    }
}
//# sourceMappingURL=middleware.js.map