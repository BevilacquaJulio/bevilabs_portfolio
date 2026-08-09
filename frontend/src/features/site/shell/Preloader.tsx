import { useEffect } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { HERO } from '@/features/site/data/content';
import { PRELOADER_MS } from './boot';

const WORD = HERO.wordmark[0].toUpperCase();
const MARK = HERO.wordmark[1].toUpperCase();

/** A cortina sobe com uma curva firme: sai devagar, acelera, para seco. */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const LETTER_EASE = [0.22, 1, 0.36, 1] as const;

const TIMING = {
  firstLetter: 0.12,
  letterStep: 0.045,
  labs: 0.72,
  barStart: 0.38,
  barDuration: (PRELOADER_MS - 520) / 1000,
} as const;

const SEGMENTS = 12;

type PreloaderProps = { onDone: () => void };

/**
 * Cortina de abertura.
 *
 * Letreiro BEVILACQUA + LABS vazado, maior que na hero. Três segundos no total:
 * o `setTimeout` manda, as animações internas só precisam caber nele.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const progress = useMotionValue(0);

  useEffect(() => {
    document.body.dataset.preloader = 'true';
    window.scrollTo(0, 0);

    const bar = animate(progress, 1, {
      duration: TIMING.barDuration,
      delay: TIMING.barStart,
      ease: [0.22, 0.85, 0.28, 1],
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
        className="relative flex w-full max-w-lg flex-col items-center"
      >
        <p
          aria-hidden="true"
          className="flex items-center justify-center whitespace-nowrap font-futuristic leading-[0.88] text-on-dark [font-feature-settings:'liga'_1,'calt'_1] [--preloader-word-size:clamp(2.35rem,12vw,4.35rem)]"
        >
          <span
            style={{ fontSize: 'var(--preloader-word-size)' }}
            className="flex font-normal tracking-[-0.01em]"
          >
            {WORD.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="-mx-[0.05em] -mb-[0.2em] inline-block overflow-hidden px-[0.05em] pb-[0.2em]"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: '135%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.5,
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
            initial={{ opacity: 0, x: -10, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: TIMING.labs, ease: LETTER_EASE }}
            style={{ fontSize: 'max(0.85rem, calc(var(--preloader-word-size) - 8px))' }}
            className="ml-[clamp(0.45rem,1.4vw,1.1rem)] inline-block self-center font-normal tracking-[0.035em] text-transparent [-webkit-text-stroke:1.5px_var(--color-accent-soft)] sm:[-webkit-text-stroke:2px_var(--color-accent-soft)]"
          >
            {MARK}
          </motion.span>
        </p>

        <PreloaderProgress progress={progress} barStart={TIMING.barStart} />
      </motion.div>
    </motion.div>
  );
}

type PreloaderProgressProps = {
  progress: MotionValue<number>;
  barStart: number;
};

/** Trilho segmentado + tubo de vidro com feixe, shimmer e percentual. */
function PreloaderProgress({ progress, barStart }: PreloaderProgressProps) {
  const percent = useTransform(progress, (value) => Math.round(value * 100));
  const beamX = useTransform(progress, (value) => `${value * 100}%`);
  const shimmerOpacity = useTransform(progress, [0, 0.05, 1], [0, 0.85, 0.85]);
  const ringScale = useTransform(progress, [0, 1], [0.92, 1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: barStart }}
      className="preloader-progress mt-10 w-full max-w-[22rem] sm:mt-12 sm:max-w-[24rem]"
    >
      <div
        aria-hidden="true"
        className="mb-3.5 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <ProgressSegment key={index} index={index} progress={progress} total={SEGMENTS} />
        ))}
      </div>

      <motion.div
        style={{ scale: ringScale }}
        className="relative rounded-full p-px [background:linear-gradient(90deg,rgb(255_255_255/0.08),rgb(var(--accent-rgb)/0.55),rgb(255_255_255/0.12))]"
      >
        <div className="relative h-3 overflow-hidden rounded-full bg-[rgb(7_18_36/0.72)] [box-shadow:inset_0_1px_0_rgb(255_255_255/0.06),inset_0_-8px_16px_rgb(0_0_0/0.35)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.14] [background:repeating-linear-gradient(90deg,transparent_0,transparent_7px,rgb(255_255_255/0.9)_7px,rgb(255_255_255/0.9)_8px)]"
          />

          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-accent/70 via-accent-soft to-[rgb(186_215_255/0.95)]"
          />

          <motion.span
            style={{ scaleX: progress, opacity: shimmerOpacity }}
            className="preloader-shimmer absolute inset-y-0 left-0 w-full origin-left bg-[linear-gradient(105deg,transparent_0%,rgb(255_255_255/0.45)_45%,transparent_90%)]"
          />

          <motion.span
            style={{ left: beamX }}
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="relative block size-3.5 rounded-full bg-white [box-shadow:0_0_18px_2px_rgb(255_255_255/0.95),0_0_36px_6px_rgb(var(--accent-rgb)/0.55)]" />
            <span className="absolute inset-0 block animate-ping rounded-full bg-accent-soft/35 motion-reduce:hidden" />
          </motion.span>
        </div>
      </motion.div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p aria-hidden="true" className="meta text-on-dark-muted tracking-[0.16em] uppercase">
            Inicializando
          </p>
        
        </div>
        <p
          aria-hidden="true"
          className="font-display text-[clamp(1.35rem,5vw,1.65rem)] leading-none font-bold tracking-[-0.04em] text-on-dark tabular-nums"
        >
          <motion.span>{percent}</motion.span>
          <span className="ml-0.5 text-[0.55em] font-medium text-accent-soft">%</span>
        </p>
      </div>
    </motion.div>
  );
}

type ProgressSegmentProps = {
  index: number;
  progress: MotionValue<number>;
  total: number;
};

/** Célula do equalizador: acende quando o progresso a atravessa. */
function ProgressSegment({ index, progress, total }: ProgressSegmentProps) {
  const start = index / total;
  const end = (index + 1) / total;
  const fill = useTransform(progress, [start, end], [0, 1]);
  const height = useTransform(fill, [0, 1], ['22%', '100%']);
  const glow = useTransform(fill, [0, 1], [0.12, 1]);

  return (
    <span className="relative flex h-5 items-end justify-center">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-full rounded-[3px] bg-white/[0.07]"
      />
      <motion.span
        style={{ height, opacity: glow }}
        className="relative w-full origin-bottom rounded-[3px] bg-gradient-to-t from-accent via-accent-soft to-white/85 [box-shadow:0_0_14px_rgb(var(--accent-rgb)/0.35)]"
      />
    </span>
  );
}
