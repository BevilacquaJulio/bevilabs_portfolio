import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { buildMariaDbPoolConfig } from '../src/config/database-url';
import { loadEnv } from '../src/config/load-env';

loadEnv();

/** Testa leitura da tabela projects — util para diagnosticar erro 500 na listagem. */
async function main(): Promise<void> {
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(buildMariaDbPoolConfig()) });

  try {
    const rows = await prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    const total = await prisma.project.count();

    console.log(`Banco: ${process.env.MYSQL_DATABASE ?? '(nao definido)'}`);
    console.log(`Tabela projects: OK (${total} registro(s))`);
    if (rows.length > 0) {
      console.log('Amostra:', rows.map((p) => ({ id: p.id, title: p.title })));
    }
  } catch (error) {
    console.error('Falha ao ler projects:');
    console.error(error instanceof Error ? error.message : error);
    console.error('Confira sql/ensure_projects_table.sql e rode: docker compose run --rm migrate');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
