import { useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

const DESKTOP_POINTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const DOT_SPRING = { stiffness: 170, damping: 26, mass: 0.42 } as const;
const PRESENCE_SPRING = { stiffness: 260, damping: 28, mass: 0.35 } as const;

/**
 * Coordenadas do foco dentro de uma seção pontilhada.
 *
 * Motion values mantêm o movimento fora do ciclo de render do React. O teste
 * de media query garante que uma janela estreita em um desktop também use o
 * comportamento mobile, mesmo que o dispositivo tenha mouse.
 */
export function useDottedFieldPointer() {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const rawPresence = useMotionValue(0);

  const smoothX = useSpring(rawX, DOT_SPRING);
  const smoothY = useSpring(rawY, DOT_SPRING);
  const presence = useSpring(rawPresence, PRESENCE_SPRING);

  const x = useTransform(smoothX, (value) => `${value * 100}%`);
  const y = useTransform(smoothY, (value) => `${value * 100}%`);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (
        reducedMotion ||
        event.pointerType !== 'mouse' ||
        !window.matchMedia(DESKTOP_POINTER).matches
      ) {
        return;
      }

      const box = event.currentTarget.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      rawX.set((event.clientX - box.left) / box.width);
      rawY.set((event.clientY - box.top) / box.height);
      rawPresence.set(1);
    },
    [rawPresence, rawX, rawY, reducedMotion],
  );

  const onPointerLeave = useCallback(() => {
    rawPresence.set(0);
  }, [rawPresence]);

  return { x, y, presence, onPointerMove, onPointerLeave };
}
