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
const getPepperedPassword = (password) => password + env_1.env.PASSWORD_PEPPER;
async function generateReferralCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    for (let attempt = 0; attempt < 5; attempt++) {
        let randomPart = '';
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const code = `PNX-${randomPart}`;
        const existing = await db_1.db.user.findUnique({
            where: { referralCode: code },
            select: { id: true }
        });
        if (!existing)
            return code;
    }
    return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
async function createUser(input) {
    const email = input.email.toLowerCase();
    const where = [{ email }];
    if (input.walletAddress)
        where.push({ walletAddress: input.walletAddress });
    if (input.username)
        where.push({ username: input.username });
    let existingUser = null;
    try {
        try {
            existingUser = await db_1.db.user.findFirst({ where: { OR: where } });
        }
        catch (err) {
            console.warn('[AUTH] compound findFirst failed, falling back to email-only lookup:', err?.message || err);
            existingUser = await db_1.db.user.findFirst({ where: { email } });
        }
    }
    catch (err) {
        console.error('[AUTH] Database error in createUser lookup:', {
            message: err?.message,
            code: err?.code,
        });
        throw new errors_1.InternalServerError();
    }
    if (existingUser) {
        if (existingUser.email === email) {
            throw new errors_1.ConflictError('Email already registered');
        }
        if (input.username && existingUser.username === input.username) {
            throw new errors_1.ConflictError('Username already taken');
        }
        if (input.walletAddress && existingUser.walletAddress === input.walletAddress) {
            throw new errors_1.ConflictError('Wallet already linked');
        }
        throw new errors_1.ConflictError('User already exists');
    }
    let referredById = null;
    let bonusPoints = 0;
    if (input.referralCode) {
        try {
            const referrer = await db_1.db.user.findFirst({
                where: { referralCode: input.referralCode },
                select: { id: true },
            });
            if (referrer) {
                referredById = referrer.id;
                bonusPoints = 75;
                await db_1.db.user.update({
                    where: { id: referrer.id },
                    data: { pxpBalance: { increment: 150 } },
                    select: { id: true }
                });
            }
        }
        catch (err) {
            console.error('[AUTH] Referral lookup error (non-fatal):', err?.message);
        }
    }
    let hashedPassword = null;
    if (input.password) {
        const peppered = getPepperedPassword(input.password);
        hashedPassword = await bcrypt_1.default.hash(peppered, 12);
    }
    const referralCode = await generateReferralCode();
    try {
        return await db_1.db.user.create({
            data: {
                walletAddress: input.walletAddress ?? undefined,
                email: email,
                username: input.username ?? null,
                password: hashedPassword,
                referredById,
                pxpBalance: bonusPoints,
                referralCode,
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
            },
        });
    }
    catch (err) {
        console.error('[AUTH] Database error in createUser:', {
            message: err?.message,
            code: err?.code,
        });
        throw new errors_1.InternalServerError();
    }
}
async function loginUser(input) {
    if (input.email && input.password) {
        const email = input.email.toLowerCase();
        console.debug(`[AUTH] email login attempt for ${email}`);
        let user = null;
        try {
            user = await db_1.db.user.findFirst({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    username: true,
                    walletAddress: true,
                    role: true,
                    referralCode: true,
                    pxpBalance: true,
                    isBanned: true
                }
            });
        }
        catch (err) {
            console.error('[AUTH] Database error in loginUser lookup:', {
                message: err?.message,
                code: err?.code,
            });
            throw new errors_1.InternalServerError('Unable to log in at the moment. Please try again.');
        }
        if (!user) {
            console.debug(`[AUTH] no user found for email=${email}`);
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        if (user.isBanned) {
            console.warn(`[AUTH] Banned user attempted login: ${email}`);
            throw new errors_1.ForbiddenError('Account suspended');
        }
        if (user.password) {
            const peppered = getPepperedPassword(input.password);
            console.debug(`[AUTH] login attempt email=${email} id=${user.id} hasPassword=${!!user.password}`);
            let valid = await bcrypt_1.default.compare(peppered, user.password);
            if (!valid) {
                const legacyValid = await bcrypt_1.default.compare(input.password, user.password);
                if (legacyValid) {
                    try {
                        const newPepperedHash = await bcrypt_1.default.hash(peppered, 12);
                        await db_1.db.user.update({ where: { id: user.id }, data: { password: newPepperedHash }, select: { id: true } });
                        valid = true;
                        console.log(`[AUTH] Seamlessly upgraded password for user: ${user.email}`);
                    }
                    catch (err) {
                        console.error('[AUTH] Password upgrade error (non-fatal):', err?.message);
                        valid = true;
                    }
                }
            }
            if (!valid) {
                console.debug(`[AUTH] password mismatch for email=${email} id=${user.id}`);
                throw new errors_1.UnauthorizedError('Invalid email or password');
            }
        }
        else {
            console.debug(`[AUTH] no password set for email=${email}`);
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        return user;
    }
    throw new errors_1.UnauthorizedError('Invalid login credentials');
}
async function checkReferralCode(code) {
    try {
        const referrer = await db_1.db.user.findFirst({
            where: { referralCode: code },
            select: { id: true },
        });
        return !!referrer;
    }
    catch (err) {
        console.error('[AUTH] Database error in checkReferralCode:', err?.message);
        return false;
    }
}
//# sourceMappingURL=service.js.map