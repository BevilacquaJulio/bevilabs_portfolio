import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { HERO, PROFILE } from '../data/content';

const ACTION_BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[0.84rem] font-semibold ' +
  'transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[var(--ease-out)] ' +
  'active:scale-[0.97] motion-reduce:active:scale-100';

/** Curva de saída do título mascarado. Cada palavra sobe de dentro do próprio bloco. */
const WORD_EASE = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // O conteúdo recua discretamente sem comprometer a leitura ou os controles.
  const contentOpacity = useTransform(scrollYProgress, [0, 0.92], [1, 0.72]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const contentStyle: MotionStyle | undefined = reducedMotion
    ? undefined
    : { opacity: contentOpacity, y: contentY };

  const facts = [...HERO.facts, { label: 'Base', value: PROFILE.location }] as const;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative z-2 flex min-h-[min(100svh,44rem)] items-center overflow-hidden border-b border-line pt-[calc(var(--header-h)+env(safe-area-inset-top)+0.5rem)] pb-5 md:min-h-[min(86svh,42rem)] md:pt-[calc(var(--header-h)+1rem)] md:pb-7"
    >
      <motion.div
        style={contentStyle}
        variants={staggerContainer}
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        className="layout w-full"
      >
        <motion.div
          variants={staggerItem}
          className="flex flex-col items-start gap-2.5 border-b border-line pb-3.5 font-mono text-[0.65rem] font-medium tracking-[0.085em] uppercase sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-3 sm:pb-4 sm:text-[0.7rem] sm:tracking-[0.105em] md:text-xs"
        >
          <span className="flex flex-col items-start gap-1 min-[360px]:flex-row min-[360px]:flex-wrap min-[360px]:items-center min-[360px]:gap-x-2.5">
            <span className="text-fg">{PROFILE.name}</span>
            <span aria-hidden="true" className="hidden text-line-strong min-[360px]:inline">
              /
            </span>
            <span className="text-fg-muted">{HERO.role}</span>
          </span>
          <span className="inline-flex items-center gap-2 text-fg-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
            {HERO.status}
          </span>
        </motion.div>

        <div className="grid items-center gap-7 pt-5 md:gap-8 md:pt-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <h1
              id="hero-title"
              aria-label={`${HERO.title.join(' ')} ${HERO.titleAccent.join(' ')}`}
              className="max-w-[15.5ch] font-display text-[1.72rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[1.95rem] md:text-[clamp(1.95rem,3.5vw,3.25rem)] md:leading-[1.06] md:tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                {HERO.title.map((word, index) => (
                  <MaskedWord
                    key={`${word}-${index}`}
                    word={word}
                    index={index}
                    reduced={Boolean(reducedMotion)}
                  />
                ))}
              </span>
              <span aria-hidden="true" className="text-fg-muted">
                {HERO.titleAccent.map((word, index) => (
                  <MaskedWord
                    key={`${word}-${index}`}
                    word={word}
                    index={HERO.title.length + index}
                    reduced={Boolean(reducedMotion)}
                  />
                ))}
              </span>
            </h1>

            <motion.p
              variants={staggerItem}
              className="mt-4 max-w-[51ch] text-[0.92rem] leading-[1.62] text-fg-muted sm:text-[0.95rem] md:mt-6 md:text-base"
            >
              {HERO.subtitle}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-5 flex flex-wrap gap-2.5 md:mt-6 md:gap-3"
            >
              <a
                href={HERO.ctaPrimary.href}
                className={`${ACTION_BASE} w-full border border-ink bg-ink text-paper shadow-[0_10px_24px_rgb(16_16_15_/_0.14)] hover:-translate-y-px hover:shadow-[0_14px_32px_rgb(16_16_15_/_0.2)] sm:w-auto`}
              >
                {HERO.ctaPrimary.label}
                <Icon name="arrowUpRight" className="size-4" weight="bold" />
              </a>
              <a
                href={HERO.ctaSecondary.href}
                className={`${ACTION_BASE} w-full border border-line-strong bg-bg-elevated text-fg hover:border-ink hover:bg-bg-subtle sm:w-auto`}
              >
                {HERO.ctaSecondary.label}
              </a>
            </motion.div>

            <motion.dl
              variants={staggerItem}
              className="mt-6 grid grid-cols-2 border-y border-line sm:grid-cols-3 md:mt-8"
            >
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`py-3 pr-3 sm:py-3.5 ${
                    index === facts.length - 1
                      ? 'col-span-2 border-t border-line sm:col-span-1 sm:border-t-0 sm:pl-4'
                      : index > 0
                        ? 'border-l border-line pl-4'
                        : ''
                  }`}
                >
                  <dt className="font-mono text-[0.62rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold tracking-[-0.015em] text-fg">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.aside
            variants={staggerItem}
            aria-label="Resumo do escopo profissional"
            className="relative min-w-0 rounded-[1rem] border border-line bg-bg-elevated/80 p-4 shadow-[0_16px_45px_rgb(16_16_15_/_0.045)] sm:rounded-[1.25rem] sm:p-6 lg:col-span-5 lg:p-7"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line pb-3.5 font-mono text-[0.64rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
              <span>{HERO.focus.eyebrow}</span>
              <span>Full stack</span>
            </div>

            <h2 className="mt-4 max-w-[17ch] font-display text-[1.28rem] leading-[1.12] font-semibold tracking-[-0.032em] text-balance sm:mt-4 sm:text-[1.4rem] md:text-[clamp(1.4rem,1.95vw,1.75rem)] md:leading-[1.1] md:tracking-[-0.036em]">
              {HERO.focus.title}
            </h2>
            <p className="mt-3.5 max-w-[43ch] text-[0.9rem] leading-[1.62] text-fg-muted">
              {HERO.focus.text}
            </p>

            <dl className="mt-5 border-y border-line sm:mt-6">
              {HERO.focus.areas.map((area) => (
                <div
                  key={area.label}
                  className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[7.5rem_1fr] sm:gap-5 sm:py-3.5"
                >
                  <dt className="font-mono text-[0.64rem] font-medium tracking-[0.09em] text-fg-subtle uppercase">
                    {area.label}
                  </dt>
                  <dd className="text-sm font-semibold tracking-[-0.012em] text-fg sm:text-right">
                    {area.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 sm:mt-6">
              <p className="font-mono text-[0.62rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
                Cobertura do sistema
              </p>
              <div className="relative mt-3.5">
                <motion.span
                  aria-hidden="true"
                  initial={reducedMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.58, duration: 0.58, ease: WORD_EASE }}
                  className="absolute top-[0.27rem] right-[10%] left-[10%] h-px origin-left bg-line-strong"
                />
                <ul className="relative grid grid-cols-4 gap-1">
                  {HERO.focus.flow.map((label, index) => (
                    <li key={label} className="min-w-0 text-center">
                      <motion.span
                        aria-hidden="true"
                        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.64 + index * 0.08,
                          duration: 0.28,
                          ease: WORD_EASE,
                        }}
                        className="mx-auto block size-2.5 rounded-full border-2 border-bg-elevated bg-ink"
                      />
                      <span className="mt-2.5 block truncate font-mono text-[0.56rem] tracking-[0.07em] text-fg-subtle uppercase sm:text-[0.6rem]">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Palavra do titulo dentro de uma mascara.
 * O padding compensa a altura de acentos e cedilhas, que a mascara cortaria.
 */
function MaskedWord({
  word,
  index,
  reduced,
  className = '',
}: {
  word: string;
  index: number;
  reduced: boolean;
  className?: string;
}) {
  return (
    <span className="mr-[0.22em] inline-block overflow-hidden pb-[0.09em] align-bottom -mb-[0.09em]">
      <motion.span
        initial={reduced ? false : { y: '108%' }}
        animate={{ y: '0%' }}
        transition={{ delay: 0.08 + index * 0.045, duration: 0.5, ease: WORD_EASE }}
        className={`inline-block ${className}`}
      >
        {word}
      </motion.span>
    </span>
  );
}
