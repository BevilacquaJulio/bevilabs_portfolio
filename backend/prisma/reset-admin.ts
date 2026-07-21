import { hash } from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { readAdminPassword, readAdminUsername } from '../src/config/admin-credentials';
import { buildDatabaseUrl } from '../src/config/database-url';
import { loadEnv } from '../src/config/load-env';

loadEnv();

/**
 * Recria ou atualiza a senha do admin a partir do .env.
 * Use quando o seed ja rodou mas a senha no banco nao bate (deploy antigo, .env alterado, etc.).
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(buildDatabaseUrl()) });

  const username = readAdminUsername();
  const password = readAdminPassword();

  if (!password) {
    console.error('ADMIN_PASSWORD nao definido. Reset abortado.');
    process.exitCode = 1;
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Senha do usuario "${username}" sincronizada com o .env (${password.length} caracteres).`);
  await prisma.$disconnect();
}

void main();
