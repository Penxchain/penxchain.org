import { PrismaClient } from '@prisma/client';

/**
 * Standard Prisma Client initialization for Railway.
 * We avoid driver adapters here to prevent validation errors in the container environment.
 */
export const db = new PrismaClient({
  log: ['warn', 'error'],
});
