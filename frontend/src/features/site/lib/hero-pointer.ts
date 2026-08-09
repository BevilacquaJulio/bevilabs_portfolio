import { useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

const POINTER_SPRING = { stiffness: 120, damping: 22, mass: 0.4 } as const;

/**
 * Posição do ponteiro dentro da hero, em fração de 0 a 1.
 *
 * Fração, e não pixel, porque tudo que consome isso é percentual: a máscara do
 * brilho e o deslocamento das camadas de parallax. Assim a mesma conta serve
 * para 375px e para 2560px de largura, sem breakpoint.
 *
 * Fica tudo em motion value: mover o mouse não dispara render nenhum.
 */
export function useHeroPointer() {
  const reducedMotion = useReducedMotion();

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.45);
  const smoothX = useSpring(rawX, POINTER_SPRING);
  const smoothY = useSpring(rawY, POINTER_SPRING);

  const mx = useTransform(smoothX, (value) => `${value * 100}%`);
  const my = useTransform(smoothY, (value) => `${value * 100}%`);

  /** Deslocamento a partir do centro, de -0.5 a 0.5. Alimenta o parallax. */
  const offsetX = useTransform(smoothX, (value) => value - 0.5);
  const offsetY = useTransform(smoothY, (value) => value - 0.5);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reducedMotion || event.pointerType !== 'mouse') return;

      const box = event.currentTarget.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      rawX.set((event.clientX - box.left) / box.width);
      rawY.set((event.clientY - box.top) / box.height);
    },
    [reducedMotion, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.45);
  }, [rawX, rawY]);

  return { mx, my, offsetX, offsetY, onPointerMove, onPointerLeave, reducedMotion };
}
