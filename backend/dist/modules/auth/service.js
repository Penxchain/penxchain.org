"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
const db_1 = require("../../shared/database/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createUser(input) {
    const where = [{ email: input.email }];
    if (input.walletAddress)
        where.push({ walletAddress: input.walletAddress });
    if (input.username)
        where.push({ username: input.username });
    const existingUser = await db_1.db.user.findFirst({
        where: {
            OR: where,
        },
    });
    if (existingUser) {
        if (existingUser.email === input.email)
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
        const referrer = await db_1.db.user.findUnique({
            where: { referralCode: input.referralCode },
        });
        if (referrer) {
            referredById = referrer.id;
            bonusPoints = 50;
            await db_1.db.user.update({
                where: { id: referrer.id },
                data: { pxpBalance: { increment: 200 } }
            });
        }
    }
    let hashedPassword = null;
    if (input.password) {
        hashedPassword = await bcrypt_1.default.hash(input.password, 10);
    }
    return db_1.db.user.create({
        data: {
            walletAddress: input.walletAddress ?? undefined,
            email: input.email,
            username: input.username ?? null,
            password: hashedPassword,
            referredById,
            pxpBalance: bonusPoints,
        },
    });
}
async function loginUser(input) {
    let user = null;
    if (input.walletAddress) {
        user = await db_1.db.user.findUnique({
            where: { walletAddress: input.walletAddress },
        });
    }
    else if (input.email && input.password) {
        user = await db_1.db.user.findUnique({
            where: { email: input.email },
        });
        if (user && user.password) {
            const valid = await bcrypt_1.default.compare(input.password, user.password);
            if (!valid)
                throw new Error('Invalid credentials');
        }
        else {
            throw new Error('Invalid credentials');
        }
    }
    else {
        throw new Error('Invalid login parameters');
    }
    if (!user) {
        throw new Error('Invalid credentials');
    }
    return user;
}
//# sourceMappingURL=service.js.map