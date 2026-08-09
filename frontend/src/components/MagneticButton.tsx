import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useMagnetic } from '@/features/site/lib/magnetic';

type MagneticButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'style' | 'onPointerMove' | 'onPointerLeave'
> & {
  magneticStrength?: number;
};

/** Botão sem estilo visual que compartilha o hover magnético das ações principais. */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      magneticStrength = 0.26,
      disabled,
      ...props
    },
    ref,
  ) {
    const magnetic = useMagnetic(magneticStrength);

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        style={magnetic.style}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={() => {
          magnetic.onPointerLeave();
        }}
        whileTap={disabled ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.14 }}
        {...props}
      />
    );
  },
);
