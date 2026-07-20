/**
 * Monta a URL mysql:// a partir das variaveis MYSQL_*.
 * Usuario e senha sao percent-encoded para que @ # : / ? & = nao corrompam a URL.
 */
export function buildDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const host = env.MYSQL_HOST ?? 'localhost';
  const port = env.MYSQL_PORT ?? '3306';
  const database = env.MYSQL_DATABASE ?? '';
  const user = encodeURIComponent(env.MYSQL_USER ?? '');
  const password = encodeURIComponent(env.MYSQL_PASSWORD ?? '');

  return `mysql://${user}:${password}@${host}:${port}/${encodeURIComponent(database)}?charset=utf8mb4`;
}
