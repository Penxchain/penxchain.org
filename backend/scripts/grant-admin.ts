import 'dotenv/config';
import { db } from '../src/shared/database/db';

async function main() {
  const username = 'DrSpons'; // Updated from DB
  const email = 'olatunjisegunmarvelee@gmail.com';

  console.log(`Searching for user: ${username} or ${email}...`);

  let user = await db.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: email }
      ]
    }
  });

  if (!user) {
    console.log('User not found! List of all users:');
    const users = await db.user.findMany({ take: 5 });
    console.table(users.map((u: any) => ({ id: u.id, username: u.username, email: u.email, role: u.role })));
    return;
  }

  console.log(`Found user: ${user.username} (${user.email}). Current Role: ${user.role}`);

  if (user.role === 'ADMIN') {
    console.log('User is already ADMIN.');
    return;
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' }
  });

  console.log(`Successfully updated user ${updated.username} to ADMIN.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
