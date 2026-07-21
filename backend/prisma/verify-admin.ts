import { compare } from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { readAdminPassword, readAdminUsername } from '../src/config/admin-credentials';
import { buildDatabaseUrl } from '../src/config/database-url';
import { loadEnv } from '../src/config/load-env';

loadEnv();

/** Diagnostico do login admin — nao imprime a senha, so tamanho e se bate. */
async function main(): Promise<void> {
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(buildDatabaseUrl()) });

  const username = readAdminUsername();
  const password = readAdminPassword();
  const user = await prisma.adminUser.findUnique({ where: { username } });

  console.log(`Banco: ${process.env.MYSQL_DATABASE ?? '(nao definido)'}`);
  console.log(`ADMIN_USERNAME bruto: ${JSON.stringify(process.env.ADMIN_USERNAME ?? '')}`);
  console.log(`ADMIN_USERNAME usado: ${JSON.stringify(username)}`);
  console.log(`ADMIN_PASSWORD (${password.length} caracteres)`);

  if (!user) {
    const all = await prisma.adminUser.findMany({ select: { id: true, username: true } });
    console.log('Usuario NAO encontrado com esse username.');
    console.log('Usuarios no banco:', all.length ? all : '(nenhum)');
    process.exitCode = 1;
    await prisma.$disconnect();
    return;
  }

  const matches = await compare(password, user.passwordHash);
  console.log(`Usuario no banco: id=${user.id}, username=${JSON.stringify(user.username)}`);
  console.log(`Hash: ${user.passwordHash.slice(0, 12)}... (${user.passwordHash.length} chars)`);
  console.log(`Senha bate com o .env: ${matches ? 'SIM' : 'NAO'}`);

  if (!matches) {
    console.log('Rode: npm run db:reset-admin');
    process.exitCode = 1;
  }

  await prisma.$disconnect();
}

void main();
