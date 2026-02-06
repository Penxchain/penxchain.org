"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.checkReferralCode = checkReferralCode;
const db_1 = require("../../shared/database/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const errors_1 = require("../../shared/errors");
const client_1 = require("@prisma/client");
async function generateReferralCode() {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    for (let attempt = 0; attempt < 5; attempt++) {
        let randomPart = "";
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const code = `PNX-${randomPart}`;
        const existing = await db_1.db.user.findFirst({
            where: { referralCode: code },
            select: { id: true },
        });
        if (!existing)
            return code;
    }
    return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
const getPepperedPassword = (password) => password + env_1.env.PASSWORD_PEPPER;
async function createUser(input) {
    const email = input.email.toLowerCase();
    try {
        const emailUser = await db_1.db.user.findUnique({ where: { email } });
        if (emailUser)
            throw new errors_1.ConflictError("Email already registered");
        if (input.username) {
            try {
                const usernameUser = await db_1.db.user.findUnique({
                    where: { username: input.username },
                });
                if (usernameUser)
                    throw new errors_1.ConflictError("Username already taken");
            }
            catch (e) {
                if (e?.code && e.code === "P2022") {
                    console.warn("[AUTH] username lookup not available in DB, skipping");
                }
                else
                    throw e;
            }
        }
        if (input.walletAddress) {
            try {
                const walletUser = await db_1.db.user.findUnique({
                    where: { walletAddress: input.walletAddress },
                });
                if (walletUser)
                    throw new errors_1.ConflictError("Wallet already linked");
            }
            catch (e) {
                if (e?.code && e.code === "P2022") {
                    console.warn("[AUTH] walletAddress lookup not available in DB, skipping");
                }
                else
                    throw e;
            }
        }
    }
    catch (err) {
        if (err instanceof errors_1.ConflictError)
            throw err;
        console.error("[AUTH] user existence check failed:", err?.message || err);
        throw new errors_1.InternalServerError();
    }
    let referredById = null;
    if (input.referralCode) {
        const referrer = await db_1.db.user.findFirst({
            where: { referralCode: input.referralCode },
            select: { id: true },
        });
        if (referrer) {
            referredById = referrer.id;
        }
    }
    let hashedPassword = null;
    if (input.password) {
        const peppered = getPepperedPassword(input.password);
        hashedPassword = await bcrypt_1.default.hash(peppered, 12);
    }
    const referralCode = await generateReferralCode();
    try {
        return await db_1.db.$transaction(async (tx) => {
            const createData = {
                walletAddress: input.walletAddress ?? undefined,
                email: email,
                username: input.username ?? null,
                password: hashedPassword,
                referredById,
                referralCode,
            };
            if (input.deviceId)
                createData.deviceId = input.deviceId;
            const created = await tx.user.create({
                data: createData,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    walletAddress: true,
                    role: true,
                    pxpBalance: true,
                    referralCode: true,
                    referredById: true,
                    referredBy: { select: { id: true, username: true } },
                    createdAt: true,
                    lastBonusClaim: true,
                },
            });
            let wasReferred = false;
            let rewardsApplied = null;
            if (referredById) {
                const target = await tx.user.findUnique({
                    where: { id: created.id },
                    select: { referralRewarded: true },
                });
                if (target && !target.referralRewarded) {
                    const referrerBonus = 150;
                    const newUserBonus = 75;
                    await tx.user.update({
                        where: { id: referredById },
                        data: { pxpBalance: { increment: referrerBonus } },
                    });
                    await tx.user.update({
                        where: { id: created.id },
                        data: {
                            pxpBalance: { increment: newUserBonus },
                            referralRewarded: true,
                        },
                    });
                    wasReferred = true;
                    rewardsApplied = { newUser: newUserBonus, referrer: referrerBonus };
                }
            }
            return {
                ...created,
                wasReferred,
                rewardsApplied,
            };
        });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002") {
            const target = err.meta?.target;
            if (Array.isArray(target) && target.length) {
                const field = target[0];
                if (field === "email")
                    throw new errors_1.ConflictError("Email already registered");
                if (field === "username")
                    throw new errors_1.ConflictError("Username already taken");
                if (field === "walletAddress")
                    throw new errors_1.ConflictError("Wallet already linked");
            }
            throw new errors_1.ConflictError("User already exists");
        }
        console.error("[AUTH] createUser transaction failed:", err?.message || err);
        throw new errors_1.InternalServerError();
    }
}
async function loginUser(input) {
    let user = null;
    if (input.email && input.password) {
        const email = input.email.toLowerCase();
        console.debug(`[AUTH] email login attempt for ${email}`);
        user = await db_1.db.user.findFirst({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                username: true,
                walletAddress: true,
                role: true,
                pxpBalance: true,
                referralCode: true,
                dailyStreak: true,
                lastActivityDate: true,
                isBanned: true,
                banReason: true,
                bannedAt: true,
                createdAt: true,
                lastBonusClaim: true,
                tasks: {
                    select: { taskId: true },
                    where: { status: "COMPLETED" },
                },
            },
        });
        if (!user) {
            console.debug(`[AUTH] no user found for email=${email}`);
            throw new Error("Invalid credentials");
        }
        if (user.password) {
            const peppered = getPepperedPassword(input.password);
            console.debug(`[AUTH] login attempt email=${email} id=${user.id} hasPassword=${!!user.password}`);
            let valid = await bcrypt_1.default.compare(peppered, user.password);
            if (!valid) {
                const legacyValid = await bcrypt_1.default.compare(input.password, user.password);
                if (legacyValid) {
                    const newPepperedHash = await bcrypt_1.default.hash(peppered, 12);
                    await db_1.db.user.update({
                        where: { id: user.id },
                        data: { password: newPepperedHash },
                        select: { id: true },
                    });
                    valid = true;
                    console.log(`[AUTH] Seamlessly upgraded password for user: ${user.email}`);
                }
            }
            if (!valid) {
                console.debug(`[AUTH] password mismatch for email=${email} id=${user.id}`);
                throw new Error("Invalid credentials");
            }
        }
        else {
            console.debug(`[AUTH] no password set for email=${email}`);
            throw new Error("Invalid credentials");
        }
        if (user.isBanned) {
            const reason = user.banReason || "Account suspended";
            throw new errors_1.ForbiddenError(`Account Banned: ${reason}. Contact support@penxchain.org if you believe this is an error.`);
        }
        return user;
    }
    throw new Error("Invalid login parameters");
}
async function checkReferralCode(code) {
    const user = await db_1.db.user.findFirst({
        where: { referralCode: code },
        select: { id: true },
    });
    return !!user;
}
//# sourceMappingURL=service.js.map