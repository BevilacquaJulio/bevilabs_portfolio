import { useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const MAGNET_SPRING = { stiffness: 260, damping: 22, mass: 0.5 } as const;

/**
 * Botão magnético: o alvo se inclina na direção do ponteiro enquanto ele está
 * por cima, e volta ao lugar com mola quando ele sai.
 *
 * Motivo: confirmar que o elemento é acionável antes do clique.
 *
 * A medida sai de `event.currentTarget`, então o hook serve para qualquer
 * elemento e não precisa de ref. Tudo vive em motion values, fora do ciclo de
 * render: guardar a posição em estado dispararia um render por pixel.
 */
export function useMagnetic(strength = 0.3) {
  const reducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAGNET_SPRING);
  const y = useSpring(rawY, MAGNET_SPRING);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reducedMotion || event.pointerType !== 'mouse') return;

      const box = event.currentTarget.getBoundingClientRect();
      rawX.set((event.clientX - (box.left + box.width / 2)) * strength);
      rawY.set((event.clientY - (box.top + box.height / 2)) * strength);
    },
    [reducedMotion, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return {
    style: reducedMotion ? undefined : { x, y },
    onPointerMove,
    onPointerLeave,
  };
}
