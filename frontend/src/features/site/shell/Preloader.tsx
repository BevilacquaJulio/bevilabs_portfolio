import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Monogram } from '@/features/site/components/Monogram';
import { PRELOADER_MS } from './boot';

const WORD = 'BEVILACQUA';

/** A cortina sobe com uma curva firme: sai devagar, acelera, para seco. */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const LETTER_EASE = [0.22, 1, 0.36, 1] as const;

const TIMING = {
  /** O B do letreiro nasce junto com a última barriga do monograma. */
  firstLetter: 0.52,
  letterStep: 0.042,
  labs: 1.02,
  barStart: 0.28,
  barDuration: (PRELOADER_MS - 400) / 1000,
} as const;

type PreloaderProps = { onDone: () => void };

/**
 * Cortina de abertura.
 *
 * O monograma se desenha traço a traço, o B do letreiro aparece no fim desse
 * desenho e completa em BEVILACQUA, e a barra embaixo conta o carregamento.
 * Dois segundos no total, contados de fora: o `setTimeout` é a fonte de verdade
 * e as animações internas só precisam caber nele.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (value) => `${Math.round(value * 100)}`);

  useEffect(() => {
    document.body.dataset.preloader = 'true';
    window.scrollTo(0, 0);

    const bar = animate(progress, 1, {
      duration: TIMING.barDuration,
      delay: TIMING.barStart,
      ease: [0.3, 0.85, 0.35, 1],
    });

    const timer = window.setTimeout(onDone, PRELOADER_MS);

    return () => {
      delete document.body.dataset.preloader;
      bar.stop();
      window.clearTimeout(timer);
    };
  }, [onDone, progress]);

  return (
    <motion.div
      role="status"
      aria-label="Carregando o site"
      initial={{ y: 0 }}
      exit={{ y: '-101%' }}
      transition={{ duration: 0.72, ease: CURTAIN_EASE }}
      className="fixed inset-0 z-[var(--z-preloader)] flex items-center justify-center overflow-hidden bg-ink px-6 text-on-dark"
    >
      <div aria-hidden="true" className="blueprint absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgb(39_101_204/0.22),transparent_70%)]"
      />

      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.24 } }}
        className="relative flex w-full max-w-md flex-col items-center"
      >
        <Monogram
          animate
          strokeWidth={6}
          className="h-14 w-auto text-on-dark sm:h-16"
          title="Bevilacqua Labs"
        />

        <p className="mt-7 flex flex-wrap items-baseline justify-center gap-x-[0.16em] font-futuristic text-[clamp(1.5rem,7vw,2.35rem)] leading-none font-normal tracking-[-0.02em] [font-feature-settings:'liga'_1,'calt'_1] sm:mt-8">
          <span aria-hidden="true" className="inline-flex">
            {WORD.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.42,
                    delay: TIMING.firstLetter + index * TIMING.letterStep,
                    ease: LETTER_EASE,
                  }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: TIMING.labs, ease: LETTER_EASE }}
            className="font-mono text-[0.42em] font-medium tracking-[0.3em] text-accent-soft"
          >
            LABS
          </motion.span>
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: TIMING.barStart }}
          className="mt-8 flex w-full max-w-[17rem] items-center gap-3 sm:mt-10"
        >
          <span aria-hidden="true" className="h-px flex-1 overflow-hidden bg-white/14">
            <motion.span
              style={{ scaleX: progress }}
              className="block h-full w-full origin-left bg-accent-soft"
            />
          </span>
          <span
            aria-hidden="true"
            className="meta w-9 shrink-0 text-right text-on-dark-muted tabular-nums"
          >
            <motion.span>{percent}</motion.span>
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
