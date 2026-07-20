import axios from 'axios';

/**
 * Access token vive apenas em memoria (nao vaza em XSS via storage).
 * O refresh token fica em sessionStorage: some ao fechar a aba e permite
 * sobreviver a um F5 sem obrigar novo login.
 */
const REFRESH_KEY = 'bevilabs.refresh';

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setSession(tokens: { accessToken: string; refreshToken: string }): void {
  accessToken = tokens.accessToken;
  try {
    sessionStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  } catch {
    // Storage indisponivel (modo privado): a sessao vale apenas em memoria.
  }
  notify();
}

export function clearSession(): void {
  accessToken = null;
  try {
    sessionStorage.removeItem(REFRESH_KEY);
  } catch {
    // ignore
  }
  notify();
}

export function hasSession(): boolean {
  return Boolean(accessToken ?? getRefreshToken());
}

/**
 * Troca o refresh token por um novo par. Chamadas concorrentes compartilham
 * a mesma promise para nao disparar varias rotacoes em paralelo.
 */
export function refreshSession(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  const baseURL = import.meta.env.VITE_API_URL || '/api';

  refreshInFlight = axios
    .post<{ accessToken: string; refreshToken: string }>(`${baseURL}/auth/refresh`, {
      refreshToken,
    })
    .then(({ data }) => {
      setSession(data);
      return data.accessToken;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  const baseURL = import.meta.env.VITE_API_URL || '/api';

  if (refreshToken) {
    await axios.post(`${baseURL}/auth/logout`, { refreshToken }).catch(() => undefined);
  }

  clearSession();
}
