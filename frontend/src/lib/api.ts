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
    if (error.code === 'ECONNABORTED') return 'A requisição demorou demais. Tente novamente.';
    const status = error.response?.status;
    const message = error.response?.data?.error?.message;
    if (message) return message;
    if (status === 404) return 'Serviço não encontrado. Tente novamente mais tarde.';
    if (status === 502 || status === 503) return 'Serviço indisponível no momento.';

    // Sem response, há falha de rede ou o serviço não respondeu.
    if (!error.response) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return 'Você parece estar sem conexão com a internet.';
      }
      return 'Não foi possível conectar ao serviço. Tente novamente.';
    }
  }
  return fallback;
}
