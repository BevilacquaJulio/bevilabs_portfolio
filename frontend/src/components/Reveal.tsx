import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { defaultViewport, revealVariants } from '@/lib/motion';

type RevealProps = Omit<HTMLMotionProps<'div'>, 'variants' | 'children'> & {
  children: ReactNode;
  /** Atraso extra, em segundos, para escalonar blocos irmaos. */
  delay?: number;
};

/** Wrapper de reveal em scroll. Anima uma unica vez por elemento. */
export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={defaultViewport}
      variants={revealVariants}
      transition={{ delay: shouldReduceMotion ? 0 : delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
