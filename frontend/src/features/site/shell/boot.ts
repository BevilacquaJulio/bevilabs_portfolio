import { createContext, useContext } from 'react';

/**
 * Estado de boot do site.
 *
 * Enquanto o preloader está na tela, `booted` é falso e a hero segura a própria
 * animação de entrada. Assim a abertura acontece uma vez só, na ordem certa,
 * em vez de rodar escondida atrás da cortina.
 */
export const BootContext = createContext(true);

export function useBooted(): boolean {
  return useContext(BootContext);
}

/** Duração da cortina de abertura, em milissegundos. */
export const PRELOADER_MS = 2000;

const SESSION_KEY = 'bl:booted';

/**
 * O preloader roda uma vez por aba. Quem volta ao site na mesma sessão
 * (ou saiu para o admin e voltou) não assiste à abertura de novo.
 */
export function shouldSkipPreloader(): boolean {
  if (typeof window === 'undefined') return true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markPreloaderSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* Modo privativo bloqueia o storage. A abertura roda de novo, e tudo bem. */
  }
}
