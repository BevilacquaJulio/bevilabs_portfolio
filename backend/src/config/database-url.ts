import type { PoolConfig } from 'mariadb';
import { stripEnvQuotes } from './admin-credentials';

/** Config do pool MariaDB — preferido pelo Prisma adapter (evita URL mal parseada). */
export function buildMariaDbPoolConfig(env: NodeJS.ProcessEnv = process.env): PoolConfig {
  return {
    host: env.MYSQL_HOST ?? 'localhost',
    port: Number(env.MYSQL_PORT ?? 3306),
    user: stripEnvQuotes(env.MYSQL_USER ?? ''),
    password: stripEnvQuotes(env.MYSQL_PASSWORD ?? ''),
    database: stripEnvQuotes(env.MYSQL_DATABASE ?? ''),
    connectionLimit: 10,
    minimumIdle: 1,
    connectTimeout: 10_000,
    acquireTimeout: 10_000,
    idleTimeout: 60,
    // Limpa estado da conexao (ex.: transacao abortada) antes de devolver ao pool.
    resetAfterUse: true,
    charset: 'utf8mb4',
  };
}

/**
 * Monta a URL mysql:// a partir das variaveis MYSQL_*.
 * Usuario e senha sao percent-encoded para que @ # : / ? & = nao corrompam a URL.
 */
export function buildDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const cfg = buildMariaDbPoolConfig(env);
  const user = encodeURIComponent(String(cfg.user ?? ''));
  const password = encodeURIComponent(String(cfg.password ?? ''));
  const database = encodeURIComponent(String(cfg.database ?? ''));

  return `mysql://${user}:${password}@${cfg.host}:${cfg.port}/${database}?charset=utf8mb4`;
}
