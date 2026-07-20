import { hash } from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { buildDatabaseUrl } from '../src/config/database-url';
import { loadEnv } from '../src/config/load-env';

loadEnv();

/**
 * Cria o usuario admin no primeiro deploy. Idempotente: se ja existir, nao faz nada.
 * Roda manualmente (`npm run db:seed`), nunca no build da imagem.
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(buildDatabaseUrl()) });

  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (!password.trim()) {
    console.error('ADMIN_PASSWORD nao definido. Seed abortado.');
    process.exitCode = 1;
    await prisma.$disconnect();
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });

  if (existing) {
    console.log(`Usuario "${username}" ja existe. Nada a fazer.`);
  } else {
    await prisma.adminUser.create({
      data: { username, passwordHash: await hash(password, 12) },
    });
    console.log(`Usuario "${username}" criado.`);
  }

  await prisma.$disconnect();
}

void main();
