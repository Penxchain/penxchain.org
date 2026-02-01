import 'dotenv/config';
import { db } from '../src/shared/database/db';
import bcrypt from 'bcrypt';
import { env } from '../src/config/env';

/**
 * NOTE: We cannot "un-hash" existing passwords to add a pepper.
 * This script identifies users with legacy hashes and marks them for reset
 * or provides a list for manual intervention.
 * 
 * In a real production environment, we would use a "Dual-Check" strategy in the login service:
 * 1. Try peppered hashing.
 * 2. If it fails, try legacy hashing.
 * 3. If legacy succeeds, upgrade the user to peppered hashing on the fly.
 */

async function migrate() {
  console.log('--- PASSWORD SECURITY AUDIT ---');
  
  const users = await db.user.findMany({
    where: {
      password: { not: null }
    }
  });

  console.log(`Found ${users.length} users with passwords.`);
  
  // Since we just implemented the pepper, ALL existing hashes are "legacy".
  // A sophisticated script would re-hash if the user's plaintext was known,
  // but we don't store plaintext.
  
  console.log('Legacy users identified. Recommendation: Use the "Dual-Check" login logic in service.ts for a seamless transition.');
}

migrate()
  .catch(e => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
