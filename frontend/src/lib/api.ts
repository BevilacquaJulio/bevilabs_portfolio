import axios, { AxiosError, type AxiosInstance } from 'axios';
import { getAccessToken, refreshSession, clearSession } from './auth-store';

/** Envelope de erro padronizado pelo backend (AllExceptionsFilter). */
export type ApiErrorEnvelope = {
  error: { code: string; message: string; details?: unknown };
};

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableRequest = { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const original = error.config as (typeof error.config & RetriableRequest) | undefined;

    // 401 -> tenta rotacionar o refresh token uma unica vez.
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      const renewed = await refreshSession();

      if (renewed) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${renewed}`;
        return api.request(original);
      }

      clearSession();
    }

    return Promise.reject(error);
  },
);

/** Extrai a mensagem legivel do envelope do backend. */
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado.'): string {
  if (axios.isAxiosError<ApiErrorEnvelope>(error)) {
    if (error.code === 'ECONNABORTED') return 'A requisicao demorou demais. Tente novamente.';
    const message = error.response?.data?.error?.message;
    if (message) return message;
    if (!error.response) return 'Nao foi possivel falar com o servidor.';
  }
  return fallback;
}
