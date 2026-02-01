import 'dotenv/config';
import { loginUser } from '../src/modules/auth/service';
import { db } from '../src/shared/database/db';
import bcrypt from 'bcrypt';
import { env } from '../src/config/env';

async function verify() {
  console.log('--- AUTH SECURITY SYSTEM VERIFICATION ---');
  
  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  
  console.log('1. Testing Login with potential legacy password (Dual-Check test)...');
  try {
    const user = await loginUser({ email: testEmail, password: testPassword });
    console.log('✅ Login Successful!');
    console.log(`   User Role: ${user.role}`);
    
    // Check if re-hashed happened
    const finalUser = await db.user.findUnique({ where: { email: testEmail } });
    if (finalUser && finalUser.password) {
      const peppered = testPassword + env.PASSWORD_PEPPER;
      const isPeppered = await bcrypt.compare(peppered, finalUser.password);
      console.log(`   Internal Check: Is password now peppered? ${isPeppered ? 'YES (Migration Success)' : 'NO'}`);
    } else {
      console.warn('   Internal Check: Could not verify pepper (User or Password missing)');
    }
    
  } catch (e: any) {
    console.error('❌ Login Failed:', e.message || e);
    console.log('   Checking if user exists...');
    const u = await db.user.findUnique({ where: { email: testEmail } });
    if (!u) {
        console.log('   User test@example.com not found. Please register first.');
    }
  }
}

verify()
  .catch(e => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
