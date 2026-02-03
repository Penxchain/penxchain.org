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
const getPepperedPassword = (password) => password + env_1.env.PASSWORD_PEPPER;
async function createUser(input) {
    const email = input.email.toLowerCase();
    const where = [{ email }];
    if (input.walletAddress)
        where.push({ walletAddress: input.walletAddress });
    if (input.username)
        where.push({ username: input.username });
    let existingUser = null;
    try {
        existingUser = await db_1.db.user.findFirst({ where: { OR: where } });
    }
    catch (err) {
        console.warn('[AUTH] compound findFirst failed, falling back to email-only lookup:', err?.message || err);
        existingUser = await db_1.db.user.findFirst({ where: { email } });
    }
    if (existingUser) {
        if (existingUser.email === email)
            throw new Error('Email already registered');
        if (input.username && existingUser.username === input.username)
            throw new Error('Username already taken');
        if (input.walletAddress && existingUser.walletAddress === input.walletAddress)
            throw new Error('Wallet already linked');
        if (!input.username && !input.walletAddress)
            throw new Error('User already exists');
    }
    let referredById = null;
    let bonusPoints = 0;
    if (input.referralCode) {
        const referrer = await db_1.db.user.findFirst({
            where: { referralCode: input.referralCode },
            select: { id: true },
        });
        if (referrer) {
            referredById = referrer.id;
            bonusPoints = 50;
            await db_1.db.user.update({
                where: { id: referrer.id },
                data: { pxpBalance: { increment: 200 } },
                select: { id: true }
            });
        }
    }
    let hashedPassword = null;
    if (input.password) {
        const peppered = getPepperedPassword(input.password);
        hashedPassword = await bcrypt_1.default.hash(peppered, 12);
    }
    return db_1.db.user.create({
        data: {
            walletAddress: input.walletAddress ?? undefined,
            email: email,
            username: input.username ?? null,
            password: hashedPassword,
            referredById,
            pxpBalance: bonusPoints,
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
async function loginUser(input) {
    let user = null;
    if (input.email && input.password) {
        const email = input.email.toLowerCase();
        console.debug(`[AUTH] email login attempt for ${email}`);
        user = await db_1.db.user.findFirst({ where: { email }, select: { id: true, email: true, password: true, username: true, walletAddress: true, role: true } });
        if (!user) {
            console.debug(`[AUTH] no user found for email=${email}`);
            throw new Error('Invalid credentials');
        }
        if (user.password) {
            const peppered = getPepperedPassword(input.password);
            console.debug(`[AUTH] login attempt email=${email} id=${user.id} hasPassword=${!!user.password}`);
            let valid = await bcrypt_1.default.compare(peppered, user.password);
            if (!valid) {
                const legacyValid = await bcrypt_1.default.compare(input.password, user.password);
                if (legacyValid) {
                    const newPepperedHash = await bcrypt_1.default.hash(peppered, 12);
                    await db_1.db.user.update({ where: { id: user.id }, data: { password: newPepperedHash }, select: { id: true } });
                    valid = true;
                    console.log(`[AUTH] Seamlessly upgraded password for user: ${user.email}`);
                }
            }
            if (!valid) {
                console.debug(`[AUTH] password mismatch for email=${email} id=${user.id}`);
                throw new Error('Invalid credentials');
            }
        }
        else {
            console.debug(`[AUTH] no password set for email=${email}`);
            throw new Error('Invalid credentials');
        }
        return user;
    }
    throw new Error('Invalid login parameters');
}
async function checkReferralCode(code) {
    const user = await db_1.db.user.findFirst({
        where: { referralCode: code },
        select: { id: true },
    });
    return !!user;
}
//# sourceMappingURL=service.js.map