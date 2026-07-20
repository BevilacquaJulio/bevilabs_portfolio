import { defineConfig } from 'prisma/config';
import { buildDatabaseUrl } from './src/config/database-url';
import { loadEnv } from './src/config/load-env';

loadEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { seed: 'tsx prisma/seed.ts' },
  datasource: { url: buildDatabaseUrl() },
});
