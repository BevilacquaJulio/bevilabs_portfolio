import { motion } from 'framer-motion';

/**
 * Monograma BL.
 *
 * Uma haste vertical é compartilhada: o pé dela vira o L, e as duas barrigas
 * em cima formam o B. Desenhado só com traço, o que permite animá-lo como
 * escrita (`pathLength` de 0 a 1) no preloader.
 *
 * A ordem dos traços é a ordem em que um humano escreveria: haste, barriga
 * de cima, barriga de baixo, pé.
 */
export const MONOGRAM_STROKES = [
  'M20 14 V62', // haste, compartilhada pelo B e pelo L
  'M20 14 H37 a10 10 0 0 1 0 20 H20', // barriga de cima do B
  'M20 34 H39 a11 11 0 0 1 0 22 H20', // barriga de baixo do B
  'M20 62 H66', // pé do L, mais longo que as barrigas para o L se ler
] as const;

type MonogramProps = {
  className?: string;
  strokeWidth?: number;
  /** Quando verdadeiro, os traços se desenham em sequência. */
  animate?: boolean;
  /** Atraso, em segundos, antes do primeiro traço. */
  delay?: number;
  title?: string;
};

const STROKE_DURATION = 0.34;
const STROKE_GAP = 0.16;

export function Monogram({
  className,
  strokeWidth = 7,
  animate = false,
  delay = 0,
  title,
}: MonogramProps) {
  const shared = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      viewBox="0 0 86 76"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {MONOGRAM_STROKES.map((d, index) =>
        animate ? (
          <motion.path
            key={d}
            d={d}
            {...shared}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: STROKE_DURATION,
                delay: delay + index * STROKE_GAP,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: { duration: 0.01, delay: delay + index * STROKE_GAP },
            }}
          />
        ) : (
          <path key={d} d={d} {...shared} />
        ),
      )}
    </svg>
  );
}

/** Tempo total do desenho completo, em segundos. */
export const MONOGRAM_DRAW_S = (MONOGRAM_STROKES.length - 1) * STROKE_GAP + STROKE_DURATION;
