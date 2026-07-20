import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsFinePointer } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  'aria-label'?: string;
  /** Intensidade do deslocamento magnetico, em px. */
  strength?: number;
};

/**
 * Ancora com atracao magnetica sutil ao cursor.
 * Desliga em touch e quando o usuario pediu menos movimento.
 */
export function MagneticLink({
  href,
  children,
  className,
  external = false,
  strength = 6,
  ...rest
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useIsFinePointer();
  const enabled = finePointer && !reducedMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={enabled ? { x, y } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn('inline-flex', className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
