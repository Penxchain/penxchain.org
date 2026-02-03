"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
require("dotenv/config");
console.log("Loading prisma.config.ts");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");
exports.default = (0, config_1.defineConfig)({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
        shadowDatabaseUrl: process.env.DIRECT_URL,
    },
});
//# sourceMappingURL=prisma.config.js.map