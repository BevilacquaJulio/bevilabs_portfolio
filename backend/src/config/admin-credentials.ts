/** Remove aspas externas — comum em .env quando a senha tem # ou espacos. */
export function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/** Le credenciais do admin a partir do ambiente (seed / reset). */
export function readAdminUsername(env: NodeJS.ProcessEnv = process.env): string {
  return stripEnvQuotes(env.ADMIN_USERNAME ?? 'admin');
}

export function readAdminPassword(env: NodeJS.ProcessEnv = process.env): string {
  return stripEnvQuotes(env.ADMIN_PASSWORD ?? '');
}
