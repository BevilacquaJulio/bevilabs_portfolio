import { useReducedMotion, type Transition, type Variants } from 'framer-motion';

/**
 * Os reveals animam `y`, e nao a string `transform`.
 *
 * O Framer Motion escreve o resultado da animacao como estilo inline. Uma string
 * `transform: translateY(0px)` inline vence qualquer classe `hover:-translate-y-*`
 * do Tailwind, e o hover do card morre sem erro nenhum. Falando `y`, o hover passa
 * pelo mesmo motion value do reveal e os dois se compoem.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: [0.23, 1, 0.32, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.065, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
};

/** Viewport padrao: anima uma vez, quando 15% do bloco entra na tela. */
export const defaultViewport = { once: true, amount: 0.15 } as const;

/** Mola curta e firme: sobe rapido, assenta sem balancar. */
export const hoverSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.7,
};

/**
 * Hover unico de card do site. Todo cartao clicavel ou destacavel usa este preset,
 * para o conjunto reagir como um sistema so.
 */
export function useCardHover(distance = -6) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return {};

  return {
    whileHover: { y: distance, transition: hoverSpring },
    whileTap: { y: distance / 3, transition: { duration: 0.12 } },
  } as const;
}
