import { config } from 'dotenv';
import { resolve } from 'node:path';

/** Carrega .env do backend e da raiz — usado pelo Prisma CLI e pelo seed. */
export function loadEnv(): void {
  config({ path: resolve(process.cwd(), '.env') });
  config({ path: resolve(process.cwd(), '../.env') });
}
