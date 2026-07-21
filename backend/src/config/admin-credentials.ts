/** Le credenciais do admin a partir do ambiente (seed / reset). */
export function readAdminUsername(env: NodeJS.ProcessEnv = process.env): string {
  return (env.ADMIN_USERNAME ?? 'admin').trim();
}

/** Remove aspas externas — comum em .env quando a senha tem # ou espacos. */
export function readAdminPassword(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.ADMIN_PASSWORD ?? '';
  return raw.replace(/^["']|["']$/g, '').trim();
}
