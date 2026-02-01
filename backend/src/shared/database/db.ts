import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase/Neon/etc often
});
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});
