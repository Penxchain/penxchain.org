"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.db = new client_1.PrismaClient({
    adapter,
    log: ['warn', 'error'],
});
//# sourceMappingURL=db.js.map