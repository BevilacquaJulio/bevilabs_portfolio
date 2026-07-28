import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { buildMariaDbPoolConfig } from '../src/config/database-url';
import { loadEnv } from '../src/config/load-env';

loadEnv();

/** Testa leitura da tabela projects — util para diagnosticar erro 500 na listagem. */
async function main(): Promise<void> {
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(buildMariaDbPoolConfig()) });

  try {
    await prisma.$queryRaw`SELECT 1`;

    const columns = await prisma.$queryRaw<{ Field: string }[]>`
      SHOW COLUMNS FROM projects
    `;
    const names = columns.map((c) => c.Field);
    const required = ['id', 'title', 'icon', 'description', 'link', 'created_at', 'updated_at'];
    const missing = required.filter((name) => !names.includes(name));

    if (missing.length > 0) {
      console.error(`Colunas ausentes em projects: ${missing.join(', ')}`);
      console.error('Rode sql/ensure_projects_table.sql no phpMyAdmin/DBeaver.');
      process.exitCode = 1;
      return;
    }

    const rows = await prisma.$queryRaw<{ id: string; title: string }[]>`
      SELECT id, title FROM projects ORDER BY created_at DESC LIMIT 5
    `;
    const countRows = await prisma.$queryRaw<[{ total: bigint | number }]>`
      SELECT COUNT(*) AS total FROM projects
    `;
    const total = Number(countRows[0]?.total ?? 0);

    console.log(`Banco: ${process.env.MYSQL_DATABASE ?? '(nao definido)'}`);
    console.log(`Host: ${process.env.MYSQL_HOST ?? '(nao definido)'}`);
    console.log(`Tabela projects: OK (${total} registro(s))`);
    if (rows.length > 0) {
      console.log('Amostra:', rows);
    }
  } catch (error) {
    console.error('Falha ao ler projects:');
    console.error(error instanceof Error ? error.message : error);
    console.error('Reinicie a API apos o deploy: docker compose up -d --force-recreate api');
    console.error('Confira sql/ensure_projects_table.sql e rode: docker compose run --rm migrate');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
