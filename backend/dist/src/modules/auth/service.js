"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.checkReferralCode = checkReferralCode;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const db_1 = require("../../shared/database/db");
const env_1 = require("../../config/env");
const errors_1 = require("../../shared/errors");
const recaptcha_1 = require("../../shared/recaptcha");
const penalty_service_1 = require("../admin/penalty.service");
const throttle_1 = require("./throttle");
const risk_1 = require("./risk");
const BCRYPT_SALT_ROUNDS = 10;
const DUMMY_BCRYPT_HASH = "$2b$10$7EqJtq98hPqEX7fNZaFWoOHiD8WfY9qsK0kGugHgdGXN53BJ38qJm";
const GENERIC_LOGIN_ERROR = "Invalid email or password. Please try again.";
async function safeEvaluateRisk(action, context) {
    try {
        return await (0, risk_1.evaluateAuthRisk)({
            action,
            identifier: context.identifier,
            userId: context.userId,
            ip: context.ip,
            userAgent: context.userAgent,
            deviceId: context.deviceId,
            headers: context.headers,
        });
    }
    catch {
        return {
            score: 0,
            blocked: false,
            requiresStepUp: false,
            reasons: ["risk_eval_unavailable"],
            metadata: {},
        };
    }
}
const loginUserSelect = {
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
};
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function normalizeOptionalString(value) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}
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
function normalizeReferralCode(raw) {
    const value = raw?.trim().toUpperCase();
    return value || null;
}
function getPepperedPassword(password) {
    return password + env_1.env.PASSWORD_PEPPER;
}
async function assertHumanVerification(token, action, requestIp) {
    const tokenRequired = env_1.env.NODE_ENV === "production";
    if (!token) {
        if (tokenRequired) {
            throw new errors_1.BadRequestError("Security verification is required.");
        }
        return;
    }
    const { success, score, error } = await (0, recaptcha_1.verifyRecaptcha)(token, action, requestIp);
    if (!success || score < recaptcha_1.RECAPTCHA_MIN_SCORE) {
        throw new errors_1.BadRequestError(error || "Security verification failed. Please try again.");
    }
}
function mapUniqueConstraintToConflict(error) {
    const target = error.meta
        ?.target;
    const targetString = Array.isArray(target)
        ? target.join(",")
        : String(target || "");
    const normalized = targetString.toLowerCase();
    if (normalized.includes("email")) {
        return new errors_1.ConflictError("Email already registered");
    }
    if (normalized.includes("username")) {
        return new errors_1.ConflictError("Username already taken");
    }
    if (normalized.includes("walletaddress")) {
        return new errors_1.ConflictError("Wallet already linked");
    }
    if (normalized.includes("deviceid") || normalized.includes("unique_device_id")) {
        return new errors_1.ConflictError("You can no longer create another account on this device. Try logging in on your previous account.");
    }
    return new errors_1.ConflictError("User already exists");
}
async function generateReferralCode() {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    for (let attempt = 0; attempt < 5; attempt++) {
        let randomPart = "";
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt((0, crypto_1.randomInt)(chars.length));
        }
        const code = `PNX-${randomPart}`;
        const existing = await db_1.db.user.findUnique({
            where: { referralCode: code },
            select: { id: true },
        });
        if (!existing)
            return code;
    }
    return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
async function createUser(input, requestContext) {
    const signupRiskContext = {
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: input.deviceId,
    };
    const signupRisk = await safeEvaluateRisk("signup", {
        identifier: input.email,
        ip: signupRiskContext.ip,
        userAgent: signupRiskContext.userAgent,
        deviceId: signupRiskContext.deviceId,
        headers: signupRiskContext.headers,
    });
    if (signupRisk.blocked) {
        await (0, risk_1.logAuthRiskEvent)({
            action: "signup",
            identifier: input.email,
            ip: signupRiskContext.ip,
            userAgent: signupRiskContext.userAgent,
            deviceId: signupRiskContext.deviceId,
            headers: signupRiskContext.headers,
        }, signupRisk);
        throw new errors_1.TooManyRequestsError("Security policy blocked this request. Please try again later.");
    }
    if (signupRisk.requiresStepUp && !input.recaptchaToken) {
        await (0, risk_1.logAuthRiskEvent)({
            action: "signup",
            identifier: input.email,
            ip: signupRiskContext.ip,
            userAgent: signupRiskContext.userAgent,
            deviceId: signupRiskContext.deviceId,
            headers: signupRiskContext.headers,
        }, signupRisk);
        throw new errors_1.BadRequestError("Additional security verification is required.");
    }
    await assertHumanVerification(input.recaptchaToken, "signup", requestContext?.ip);
    const email = normalizeEmail(input.email);
    const username = normalizeOptionalString(input.username);
    const walletAddress = normalizeOptionalString(input.walletAddress);
    const normalizedDeviceId = normalizeDeviceId(input.deviceId);
    const normalizedReferralCode = normalizeReferralCode(input.referralCode);
    if (normalizedDeviceId) {
        const deviceOwner = await db_1.db.user.findFirst({
            where: { deviceId: normalizedDeviceId },
            select: { id: true },
        });
        if (deviceOwner) {
            throw new errors_1.ConflictError("You can no longer create another account on this device. Try logging in on your previous account.");
        }
    }
    try {
        const [referrer, hashedPassword, referralCode] = await Promise.all([
            normalizedReferralCode
                ? db_1.db.user.findUnique({
                    where: { referralCode: normalizedReferralCode },
                    select: { id: true },
                })
                : Promise.resolve(null),
            bcrypt_1.default.hash(getPepperedPassword(input.password), BCRYPT_SALT_ROUNDS),
            generateReferralCode(),
        ]);
        return await db_1.db.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: {
                    email,
                    username,
                    walletAddress,
                    password: hashedPassword,
                    referredById: referrer?.id ?? null,
                    referralCode,
                    ...(normalizedDeviceId ? { deviceId: normalizedDeviceId } : {}),
                },
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
                    dailyStreak: true,
                    lastActivityDate: true,
                    isBanned: true,
                    banReason: true,
                    bannedAt: true,
                    tokenVersion: true,
                    newUserBonusGranted: true,
                },
            });
            let updatedBalance = created.pxpBalance;
            let wasReferred = false;
            let rewardsApplied = null;
            if (created.referredById && !created.newUserBonusGranted) {
                const bonusPoints = 75;
                const updated = await tx.user.update({
                    where: { id: created.id },
                    data: {
                        pxpBalance: { increment: bonusPoints },
                        newUserBonusGranted: true,
                    },
                    select: { pxpBalance: true },
                });
                updatedBalance = updated.pxpBalance;
                wasReferred = true;
                rewardsApplied = {
                    newUser: bonusPoints,
                    referrer: "deferred_until_3_tasks",
                };
            }
            const { newUserBonusGranted: _newUserBonusGranted, ...safeCreated } = created;
            return {
                ...safeCreated,
                pxpBalance: updatedBalance,
                wasReferred,
                rewardsApplied,
            };
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw mapUniqueConstraintToConflict(error);
        }
        if (error instanceof errors_1.ConflictError || error instanceof errors_1.BadRequestError) {
            throw error;
        }
        console.error("[AUTH] createUser failed:", error?.message || error);
        throw new errors_1.InternalServerError();
    }
    finally {
        await (0, risk_1.logAuthRiskEvent)({
            action: "signup",
            identifier: input.email,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            deviceId: input.deviceId,
            headers: requestContext?.headers,
        }, signupRisk);
    }
}
async function recordFailure(identifier, requestIp) {
    try {
        await (0, throttle_1.recordFailedLoginAttempt)(identifier, requestIp);
    }
    catch {
    }
}
async function clearFailures(identifier, requestIp) {
    try {
        await (0, throttle_1.clearLoginAttemptState)(identifier, requestIp);
    }
    catch {
    }
}
async function loginUser(input, requestContext) {
    if (input.walletAddress || input.signature) {
        throw new errors_1.BadRequestError("Wallet login is not enabled on this endpoint. Use email/username login.");
    }
    const identifierRaw = (input.identifier || input.email || "").trim();
    const password = input.password || "";
    if (!identifierRaw || !password) {
        throw new errors_1.BadRequestError("Email/Username and password required.");
    }
    const isEmailLogin = identifierRaw.includes("@");
    const normalizedIdentifier = isEmailLogin
        ? identifierRaw.toLowerCase()
        : identifierRaw;
    const blockSeconds = await (0, throttle_1.getRemainingLoginBlockSeconds)(normalizedIdentifier, requestContext?.ip);
    if (blockSeconds > 0) {
        const minutes = Math.max(1, Math.ceil(blockSeconds / 60));
        throw new errors_1.TooManyRequestsError(`Too many failed login attempts. Please try again in ${minutes} minute(s).`);
    }
    const loginRisk = await safeEvaluateRisk("login", {
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
    });
    if (loginRisk.blocked) {
        await (0, risk_1.logAuthRiskEvent)({
            action: "login",
            identifier: normalizedIdentifier,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            headers: requestContext?.headers,
            deviceId: requestContext?.deviceId,
        }, loginRisk);
        throw new errors_1.TooManyRequestsError("Security policy blocked this request. Please try again later.");
    }
    if (loginRisk.requiresStepUp && !input.recaptchaToken) {
        await (0, risk_1.logAuthRiskEvent)({
            action: "login",
            identifier: normalizedIdentifier,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            headers: requestContext?.headers,
            deviceId: requestContext?.deviceId,
        }, loginRisk);
        throw new errors_1.BadRequestError("Additional security verification is required.");
    }
    let user = await Promise.all([
        assertHumanVerification(input.recaptchaToken, "login", requestContext?.ip),
        db_1.db.user.findFirst({
            where: isEmailLogin
                ? { email: normalizedIdentifier }
                : { username: normalizedIdentifier },
            select: loginUserSelect,
        }),
    ]).then(([, foundUser]) => foundUser);
    if (!user) {
        await bcrypt_1.default.compare(getPepperedPassword(password), DUMMY_BCRYPT_HASH);
        await recordFailure(normalizedIdentifier, requestContext?.ip);
        await (0, risk_1.logAuthRiskEvent)({
            action: "login",
            identifier: normalizedIdentifier,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            headers: requestContext?.headers,
            deviceId: requestContext?.deviceId,
        }, loginRisk);
        throw new errors_1.InvalidCredentialsError(GENERIC_LOGIN_ERROR);
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
            const refreshed = await db_1.db.user.findUnique({
                where: { id: user.id },
                select: loginUserSelect,
            });
            if (!refreshed ||
                refreshed.isBanned ||
                refreshed.accountStatus !== "ACTIVE") {
                throw new errors_1.AccountLockedError(null);
            }
            user = refreshed;
        }
        else {
            throw new errors_1.AccountLockedError(user.reviewEndsAt);
        }
    }
    if (!user.password) {
        await recordFailure(normalizedIdentifier, requestContext?.ip);
        await (0, risk_1.logAuthRiskEvent)({
            action: "login",
            userId: user.id,
            identifier: normalizedIdentifier,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            headers: requestContext?.headers,
            deviceId: requestContext?.deviceId,
        }, loginRisk);
        throw new errors_1.InvalidCredentialsError(GENERIC_LOGIN_ERROR);
    }
    const peppered = getPepperedPassword(password);
    let validPassword = await bcrypt_1.default.compare(peppered, user.password);
    const userId = user.id;
    if (!validPassword) {
        const legacyValid = await bcrypt_1.default.compare(password, user.password);
        if (legacyValid) {
            validPassword = true;
            bcrypt_1.default
                .hash(peppered, BCRYPT_SALT_ROUNDS)
                .then((hash) => db_1.db.user.update({
                where: { id: userId },
                data: { password: hash },
                select: { id: true },
            }))
                .catch(() => {
            });
        }
    }
    if (!validPassword) {
        await recordFailure(normalizedIdentifier, requestContext?.ip);
        await (0, risk_1.logAuthRiskEvent)({
            action: "login",
            userId: user.id,
            identifier: normalizedIdentifier,
            ip: requestContext?.ip,
            userAgent: requestContext?.userAgent,
            headers: requestContext?.headers,
            deviceId: requestContext?.deviceId,
        }, loginRisk);
        throw new errors_1.InvalidCredentialsError(GENERIC_LOGIN_ERROR);
    }
    await clearFailures(normalizedIdentifier, requestContext?.ip);
    await (0, risk_1.logAuthRiskEvent)({
        action: "login",
        userId: user.id,
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
    }, loginRisk);
    return user;
}
async function checkReferralCode(code) {
    const normalizedCode = normalizeReferralCode(code);
    if (!normalizedCode)
        return false;
    const user = await db_1.db.user.findUnique({
        where: { referralCode: normalizedCode },
        select: { id: true },
    });
    return !!user;
}
//# sourceMappingURL=service.js.map