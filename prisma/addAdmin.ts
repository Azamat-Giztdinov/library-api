import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { roles } from '../src/utils/roleUtils';


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10);

  const admin = await prisma.user.create({
    data: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      role: roles.ADMIN,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
