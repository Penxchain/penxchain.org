"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/shared/database/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@penxchain.org';
    const password = process.env.ADMIN_PASSWORD || 'admin-password-123';
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const admin = await db_1.db.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            username: 'SuperAdmin',
            password: hashedPassword,
            role: 'ADMIN',
            pxpBalance: 999999,
        },
    });
    console.log(`✅ Admin user ensured: ${admin.email}`);
    if (!process.env.ADMIN_PASSWORD) {
        console.warn('⚠️  Using default admin password. Set ADMIN_PASSWORD in environment for production.');
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.db.$disconnect();
});
//# sourceMappingURL=seed.js.map