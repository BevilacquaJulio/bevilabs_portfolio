import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/** O anel arrasta atrás do ponto. A diferença de mola é o que dá a sensação de peso. */
const RING_SPRING = { stiffness: 380, damping: 30, mass: 0.55 } as const;
const DOT_SPRING = { stiffness: 1200, damping: 60, mass: 0.2 } as const;

/**
 * Cursor próprio: um ponto sólido no lugar exato do ponteiro e um anel que o
 * segue com atraso. Sobre qualquer elemento acionável o anel cresce e enche.
 *
 * O cursor nativo só é escondido depois que este componente monta e liga
 * `data-cursor="custom"` no `<html>`. Se o script falhar, o ponteiro do sistema
 * continua no lugar. Em dispositivos de toque o cursor customizado não é
 * montado.
 */
export function CursorFollower() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const ringX = useSpring(rawX, RING_SPRING);
  const ringY = useSpring(rawY, RING_SPRING);
  const dotX = useSpring(rawX, DOT_SPRING);
  const dotY = useSpring(rawY, DOT_SPRING);
  const cursorRingX = reducedMotion ? rawX : ringX;
  const cursorRingY = reducedMotion ? rawY : ringY;
  const cursorDotX = reducedMotion ? rawX : dotX;
  const cursorDotY = reducedMotion ? rawY : dotY;

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER);
    let listening = false;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };

    // Um único par de listeners no documento, com delegação por `closest`.
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.(INTERACTIVE)));
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setPressed(true);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setPressed(false);
    };

    const enable = () => {
      if (listening) return;

      listening = true;
      setEnabled(true);
      document.documentElement.dataset.cursor = 'custom';
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerover', over, { passive: true });
      window.addEventListener('pointerdown', down, { passive: true });
      window.addEventListener('pointerup', up, { passive: true });
    };

    const disable = (updateState = true) => {
      if (listening) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerover', over);
        window.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
      }

      listening = false;
      delete document.documentElement.dataset.cursor;

      if (updateState) {
        setEnabled(false);
        setActive(false);
        setPressed(false);
      }
    };

    const sync = () => {
      if (media.matches) enable();
      else disable();
    };

    sync();
    media.addEventListener('change', sync);

    return () => {
      media.removeEventListener('change', sync);
      disable(false);
    };
  }, [rawX, rawY]);

  if (!enabled) return null;

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="cursor-dot"
        style={{ x: cursorDotX, y: cursorDotY }}
        animate={{ scale: active ? 0 : pressed ? 0.6 : 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        aria-hidden="true"
        className="cursor-ring"
        style={{ x: cursorRingX, y: cursorRingY }}
        animate={{
          scale: pressed ? 0.86 : active ? 1.55 : 1,
          backgroundColor: active ? 'rgb(39 101 204 / 0.16)' : 'rgb(39 101 204 / 0.06)',
          borderColor: active ? 'rgb(39 101 204 / 0.85)' : 'rgb(39 101 204 / 0.55)',
        }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
