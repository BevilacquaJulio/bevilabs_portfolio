import {
  type useSpring,
  type Transition,
  type Variants,
} from 'framer-motion';

/**
 * Linguagem de movimento do site.
 *
 * Regra 1: só `transform` e `opacity` são animados.
 * Regra 2: os reveals animam `y`, nunca a string `transform`. O Framer grava o
 *          resultado como estilo inline, e `transform: translateY(0px)` inline
 *          vence qualquer `hover:-translate-y-*` do Tailwind — o hover morre em
 *          silêncio. Falando `y`, hover e reveal compartilham o mesmo motion value.
 * Regra 3: toda animação aqui tem um motivo declarado. Nada existe "porque ficou legal".
 */

/** Curva de saída padrão: sai rápido, assenta devagar. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/** Troca de rota. Motivo: sinalizar mudança de contexto sem custo de leitura. */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
};

/** Viewport padrão: anima uma vez, quando 18% do bloco entra na tela. */
export const defaultViewport = { once: true, amount: 0.18 } as const;

/** Mola curta e firme: sobe rápido, assenta sem balançar. */
export const hoverSpring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.65,
};

/**
 * Config de mola aceita por `useSpring`. O framer-motion não reexporta
 * `SpringOptions`, e `Transition` é largo demais: aceita `duration`/`ease`,
 * que a mola ignora.
 */
type SpringConfig = NonNullable<Parameters<typeof useSpring>[1]>;

/**
 * Mola do painel que segue o cursor. Mais frouxa, para dar peso.
 * Sem `type: 'spring'` — quem consome é `useSpring`, que já é mola.
 */
export const cursorSpring: SpringConfig = {
  stiffness: 220,
  damping: 26,
  mass: 0.5,
};

/**
 * Escalonamento por índice, limitado a 6 passos.
 * Sem o teto, uma lista de 20 itens faria o último entrar 1,4s depois do primeiro.
 */
export function stepDelay(index: number, step = 0.06, max = 6) {
  return Math.min(index, max) * step;
}
