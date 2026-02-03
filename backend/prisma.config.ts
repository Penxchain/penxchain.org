import { defineConfig } from '@prisma/config';
import "dotenv/config";

console.log("Loading prisma.config.ts");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.DIRECT_URL,
  },
});
