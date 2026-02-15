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
const recaptcha_1 = require("../../shared/recaptcha");
const client_1 = require("@prisma/client");
const penalty_service_1 = require("../admin/penalty.service");
function normalizeDeviceId(raw) {
    if (!raw)
        return null;
    const trimmed = raw.trim().toLowerCase();
    if (trimmed.length < 8 || trimmed.length > 128)
        return null;
    if (/^0+$/.test(trimmed) || /^test/.test(trimmed))
        return null;
    return trimmed;
}
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
    const normalizedDeviceId = normalizeDeviceId(input.deviceId);
    if (!normalizedDeviceId) {
        throw new errors_1.BadRequestError("A valid device identifier is required to create an account. Please ensure your browser supports this feature.");
    }
    try {
        const emailUser = await db_1.db.user.findUnique({ where: { email } });
        if (emailUser)
            throw new errors_1.ConflictError("Email already registered");
        const existingDeviceUser = await db_1.db.user.findFirst({
            where: { deviceId: normalizedDeviceId },
            select: { id: true },
        });
        if (existingDeviceUser) {
            throw new errors_1.ConflictError("You can no longer create another account on this device. Try logging in on your previous account.");
        }
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
            createData.deviceId = normalizedDeviceId;
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
                    select: { newUserBonusGranted: true },
                });
                if (target && !target.newUserBonusGranted) {
                    const newUserBonus = 75;
                    await tx.user.update({
                        where: { id: created.id },
                        data: {
                            pxpBalance: { increment: newUserBonus },
                            newUserBonusGranted: true,
                            referralRewarded: true,
                        },
                    });
                    wasReferred = true;
                    rewardsApplied = { newUser: newUserBonus, referrer: "deferred_until_3_tasks" };
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
    const identifier = input.identifier || input.email;
    const password = input.password;
    if (identifier && password) {
        const isEmail = identifier.includes("@");
        const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier;
        console.debug(`[AUTH] login attempt for ${normalizedIdentifier} (isEmail=${isEmail})`);
        const recaptchaPromise = input.recaptchaToken
            ? (0, recaptcha_1.verifyRecaptcha)(input.recaptchaToken, 'login')
            : Promise.resolve({ success: true, score: 1, error: undefined });
        const userPromise = db_1.db.user.findFirst({
            where: isEmail
                ? { email: normalizedIdentifier }
                : { username: normalizedIdentifier },
            select: {
                id: true,
                email: true,
                password: true,
                username: true,
                walletAddress: true,
                role: true,
                pxpBalance: true,
                referralCode: true,
                createdAt: true,
                lastBonusClaim: true,
                dailyStreak: true,
                lastActivityDate: true,
                isBanned: true,
                banReason: true,
                bannedAt: true,
                accountStatus: true,
                reviewEndsAt: true,
                tokenVersion: true,
            },
        });
        const [recaptchaResult, user] = await Promise.all([recaptchaPromise, userPromise]);
        if (!recaptchaResult.success || (recaptchaResult.score !== undefined && recaptchaResult.score < recaptcha_1.RECAPTCHA_MIN_SCORE)) {
            throw new errors_1.BadRequestError(recaptchaResult.error || "Security verification failed. Please try again.");
        }
        if (!user) {
            console.debug(`[AUTH] no user found for identifier=${normalizedIdentifier}`);
            throw new errors_1.InvalidCredentialsError(isEmail
                ? "No account found with this email"
                : "No account found with this username");
        }
        if (user.isBanned || user.accountStatus === "BANNED") {
            throw new errors_1.InvalidCredentialsError(`Account suspended: ${user.banReason || "Violation of terms"}`);
        }
        if (user.accountStatus === "UNDER_REVIEW") {
            if (user.reviewEndsAt && new Date() >= new Date(user.reviewEndsAt)) {
                const settled = await (0, penalty_service_1.lazySettleIfDue)(user.id);
                if (!settled) {
                    throw new errors_1.AccountLockedError(user.reviewEndsAt);
                }
                const freshUser = await db_1.db.user.findUnique({
                    where: { id: user.id },
                    select: {
                        id: true, email: true, password: true, username: true,
                        walletAddress: true, role: true, pxpBalance: true,
                        referralCode: true, createdAt: true, lastBonusClaim: true,
                        dailyStreak: true, lastActivityDate: true,
                        isBanned: true, banReason: true, bannedAt: true,
                        accountStatus: true, reviewEndsAt: true, tokenVersion: true,
                    },
                });
                if (!freshUser || freshUser.isBanned || freshUser.accountStatus !== "ACTIVE") {
                    throw new errors_1.AccountLockedError(null);
                }
                Object.assign(user, freshUser);
            }
            else {
                throw new errors_1.AccountLockedError(user.reviewEndsAt);
            }
        }
        if (user.password) {
            const peppered = getPepperedPassword(password);
            let valid = await bcrypt_1.default.compare(peppered, user.password);
            if (!valid) {
                const legacyValid = await bcrypt_1.default.compare(password, user.password);
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
                console.debug(`[AUTH] password mismatch for identifier=${normalizedIdentifier} id=${user.id}`);
                throw new errors_1.InvalidCredentialsError("Incorrect password. Please try again.");
            }
        }
        else {
            console.debug(`[AUTH] no password set for identifier=${normalizedIdentifier}`);
            throw new errors_1.InvalidCredentialsError("This account requires a different login method (e.g. Wallet/Social)");
        }
        return user;
    }
    throw new errors_1.BadRequestError("Invalid login parameters. Email/Username and password required.");
}
async function checkReferralCode(code) {
    const user = await db_1.db.user.findFirst({
        where: { referralCode: code },
        select: { id: true },
    });
    return !!user;
}
//# sourceMappingURL=service.js.map