import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { defaultViewport, revealVariants } from '@/lib/motion';

type RevealProps = Omit<HTMLMotionProps<'div'>, 'variants' | 'children'> & {
  children: ReactNode;
  /** Atraso extra, em segundos, para escalonar blocos irmaos. */
  delay?: number;
};

/** Wrapper de reveal em scroll. Anima uma unica vez por elemento. */
export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={revealVariants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
