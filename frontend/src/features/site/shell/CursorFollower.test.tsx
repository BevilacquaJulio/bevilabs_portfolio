import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CursorFollower } from './CursorFollower';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

type MediaController = {
  setMatches: (matches: boolean) => void;
  matchMedia: ReturnType<typeof vi.fn>;
};

function installDesktopMedia(initialMatches: boolean): MediaController {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const desktopMedia = {
    get matches() {
      return matches;
    },
    media: '(hover: hover) and (pointer: fine)',
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as MediaQueryList;

  const matchMedia = vi.fn(() => desktopMedia);
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  });

  return {
    matchMedia,
    setMatches(next) {
      matches = next;
      const event = { matches: next, media: desktopMedia.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.cursor;
  motionState.reduced = false;
  vi.restoreAllMocks();
});

describe('CursorFollower', () => {
  it('mantem o cursor nativo quando o dispositivo nao tem ponteiro fino', () => {
    const media = installDesktopMedia(false);

    render(<CursorFollower />);

    expect(media.matchMedia).toHaveBeenCalledWith('(hover: hover) and (pointer: fine)');
    expect(document.documentElement).not.toHaveAttribute('data-cursor');
    expect(document.querySelector('.cursor-dot')).toBeNull();
    expect(document.querySelector('.cursor-ring')).toBeNull();
  });

  it('ativa quando existe um ponteiro fino', async () => {
    installDesktopMedia(true);

    render(<CursorFollower />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-cursor', 'custom'));
    expect(document.querySelector('.cursor-dot')).toBeInTheDocument();
    expect(document.querySelector('.cursor-ring')).toBeInTheDocument();
  });

  it('permanece estilizado quando o usuario reduz animacoes', async () => {
    motionState.reduced = true;
    installDesktopMedia(true);

    render(<CursorFollower />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-cursor', 'custom'));
    expect(document.querySelector('.cursor-ring')).toBeInTheDocument();
  });

  it('volta ao cursor nativo ao trocar para um ponteiro sem precisao', async () => {
    const media = installDesktopMedia(true);
    render(<CursorFollower />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-cursor', 'custom'));

    act(() => media.setMatches(false));

    await waitFor(() => expect(document.documentElement).not.toHaveAttribute('data-cursor'));
    expect(document.querySelector('.cursor-dot')).toBeNull();
    expect(document.querySelector('.cursor-ring')).toBeNull();
  });
});
