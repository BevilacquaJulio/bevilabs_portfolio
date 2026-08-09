import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ActionButton } from '@/features/site/components/ActionButton';
import { Icon } from '@/components/Icon';
import { useBooted } from '@/features/site/shell/boot';
import { useHeroPointer } from '@/features/site/lib/hero-pointer';
import { EASE_OUT } from '@/lib/motion';
import { HERO, PROFILE } from '../data/content';
import { HeroBackground } from './HeroBackground';

const WORD = HERO.wordmark[0].toUpperCase();
const MARK = HERO.wordmark[1].toUpperCase();

/**
 * Hero.
 *
 * A abertura é o lettering: BEVILACQUA em caixa alta com LABS como assinatura
 * lateral. É o mesmo bloco que a cortina de abertura mostrou, agora em repouso,
 * o que costura carregar e chegar.
 *
 * Abaixo dele vem a apresentação direta, na ordem em que a pessoa pergunta:
 * quem é, o que faz, e o que isso significa na prática. Fecha com três provas
 * curtas, para o recrutador que só olha a primeira tela.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const booted = useBooted();
  const pointer = useHeroPointer();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = booted;
  const base = 0.04;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-title"
      onPointerMove={pointer.onPointerMove}
      onPointerLeave={pointer.onPointerLeave}
      className="surface-hero relative z-[var(--z-content)] flex min-h-[100svh] items-stretch overflow-hidden px-[var(--layout-pad)] pt-[calc(var(--header-h)+env(safe-area-inset-top)+1.25rem)] pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:items-center sm:pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:min-h-[100dvh] md:pt-[calc(var(--header-h)+env(safe-area-inset-top))] md:pb-16"
    >
      <HeroBackground
        mx={pointer.mx}
        my={pointer.my}
        offsetX={pointer.offsetX}
        offsetY={pointer.offsetY}
        reducedMotion={pointer.reducedMotion}
      />

      <motion.div
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="hero-content relative mx-auto flex w-full max-w-[var(--layout-max)] flex-col items-center justify-between sm:justify-start"
      >
        <motion.div
          role="status"
          aria-label={`${HERO.status.lead} ${HERO.status.detail}`}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: base, ease: EASE_OUT }}
          className="hero-status inline-flex max-w-full items-center rounded-full border border-accent/20 bg-white/85 p-1 pr-3 [box-shadow:0_1px_0_rgb(255_255_255/0.9)_inset,0_10px_28px_rgb(7_26_49/0.08)] backdrop-blur-md"
        >
          <span
            aria-hidden="true"
            className="mr-2 grid size-7 shrink-0 place-items-center rounded-full border border-success/15 bg-success/10 sm:mr-2.5"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
          </span>
          <span className="shrink-0 font-display text-[0.66rem] font-bold tracking-[0.08em] text-ink uppercase sm:text-[0.7rem]">
            {HERO.status.lead}
          </span>
          <span aria-hidden="true" className="mx-2.5 h-3 w-px bg-line-strong" />
          <span className="min-w-0 truncate font-mono text-[0.56rem] font-medium tracking-[0.1em] text-fg-muted uppercase sm:text-[0.61rem]">
            {HERO.status.detail}
          </span>
        </motion.div>

        {/* Marca e apresentação viajam juntas: no celular a folga da hero é
            repartida pelo `justify-between`, e este invólucro impede que ela
            entre entre a régua e o texto, que precisam ficar colados. No `sm`
            o invólucro some e a coluna volta a ser o que sempre foi. */}
        <div className="hero-lockup mt-6 flex w-full flex-col items-center sm:contents">
          {/* Bloco de marca. A largura dele governa a régua e a linha de baixo. */}
          <div className="hero-wordmark w-fit sm:mt-10">
            <h1 id="hero-title" className="sr-only">
              {PROFILE.brand}. {HERO.greeting}, {HERO.role}, {HERO.stackLine}.
            </h1>

            {/* O lockup soma 9.93em de avanço (BEVILACQUA são 6.98em já com o
              tracking negativo, mais o respiro e LABS, que anda 10px atrás).
              Em 8.4vw ele ocupa ~86% da faixa útil do celular e ainda sobra
              guarda nas laterais a 320px. O teto de 2.3rem encontra a curva do
              `sm` em 640px, então a troca de faixa não dá salto. */}
            <p
              aria-hidden="true"
              className="flex items-center justify-center whitespace-nowrap font-futuristic leading-[0.88] text-ink [font-feature-settings:'liga'_1,'calt'_1] [--hero-word-size:clamp(1.7rem,8.4vw,2.3rem)] sm:[--hero-word-size:clamp(1.28rem,5.8vw,4.5rem)]"
            >
              <span
                style={{ fontSize: 'var(--hero-word-size)' }}
                className="flex font-normal tracking-[-0.01em]"
              >
                {WORD.split('').map((letter, index) => (
                  /* O tracking negativo encolhe a caixa de cada letra para menos
                   que o avanço do glifo. O padding preserva a cauda do Q e a
                   diagonal do A durante a animação de entrada. */
                  <span
                    key={`${letter}-${index}`}
                    className="-mx-[0.05em] -mb-[0.2em] inline-block overflow-hidden px-[0.05em] pb-[0.2em]"
                  >
                    <motion.span
                      className="inline-block"
                      initial={reducedMotion ? false : { y: '135%' }}
                      animate={show ? { y: '0%' } : undefined}
                      transition={{
                        duration: 0.66,
                        delay: base + 0.08 + index * 0.035,
                        ease: EASE_OUT,
                      }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </span>
              <motion.span
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={show ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, delay: base + 0.46, ease: EASE_OUT }}
                style={{ fontSize: 'max(0.75rem, calc(var(--hero-word-size) - 10px))' }}
                className="ml-[clamp(0.4rem,1.2vw,1rem)] inline-block self-center font-normal tracking-[0.035em] text-transparent [-webkit-text-stroke:1px_var(--color-accent)] sm:[-webkit-text-stroke:1.5px_var(--color-accent)]"
              >
                {MARK}
              </motion.span>
            </p>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: base + 0.58, ease: EASE_OUT }}
              className="hero-role mt-4 flex flex-col items-center justify-center gap-2 font-display text-[clamp(0.82rem,4vw,1rem)] leading-none font-bold tracking-[-0.025em] uppercase sm:mt-5 sm:flex-row sm:gap-4 sm:text-[clamp(0.9rem,2.2vw,1.15rem)]"
            >
              <span className="text-ink">{HERO.role}</span>
              <span aria-hidden="true" className="h-px w-12 bg-line-strong sm:h-4 sm:w-px" />
              <span className="text-accent">{HERO.stackLine}</span>
            </motion.p>

            <motion.span
              aria-hidden="true"
              initial={reducedMotion ? false : { scaleX: 0 }}
              animate={show ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.85, delay: base + 0.64, ease: EASE_OUT }}
              className="hero-rule mt-4 block h-px w-full origin-center bg-line-strong sm:mt-5"
            />
          </div>

          {/* Apresentação: quem é, o que faz, e o que isso significa. */}
          <div className="hero-intro mt-5 flex flex-col items-center text-center sm:mt-6">
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span
                initial={reducedMotion ? false : { y: '108%' }}
                animate={show ? { y: '0%' } : undefined}
                transition={{ duration: 0.6, delay: base + 0.72, ease: EASE_OUT }}
                className="block font-display text-[clamp(0.9rem,4vw,1rem)] leading-[1.2] font-semibold tracking-[-0.02em] text-fg-muted sm:text-[clamp(0.9rem,2.2vw,1.12rem)]"
              >
                {HERO.greeting}
              </motion.span>
            </span>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.55, delay: base + 0.82, ease: EASE_OUT }}
              className="hero-statement mt-3 max-w-[30ch] text-[clamp(0.9rem,4vw,1rem)] leading-[1.6] text-fg-muted sm:mt-4 sm:max-w-[62ch] sm:text-[1rem]"
            >
              {HERO.statement}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: base + 0.94, ease: EASE_OUT }}
          className="hero-actions mt-6 flex w-full max-w-[23rem] flex-col items-stretch gap-2.5 sm:mt-8 sm:max-w-none sm:items-center"
        >
          <div className="grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:items-center sm:gap-3.5">
            <ActionButton
              href={HERO.ctaPrimary.href}
              variant="primary"
              size="lg"
              icon="arrowDown"
              className="w-full !min-h-[3.4rem] !px-2 text-[0.78rem] min-[360px]:!px-3 min-[360px]:text-[0.82rem] sm:w-auto sm:!min-h-12 sm:!px-7 sm:text-[0.92rem]"
            >
              {HERO.ctaPrimary.label}
            </ActionButton>

            <ActionButton
              href={HERO.ctaSecondary.href}
              variant="primary"
              size="lg"
              icon="arrowUpRight"
              className="w-full !min-h-[3.4rem] !px-2 text-[0.78rem] min-[360px]:!px-3 min-[360px]:text-[0.82rem] sm:w-auto sm:!min-h-12 sm:!px-7 sm:text-[0.92rem]"
            >
              {HERO.ctaSecondary.label}
            </ActionButton>
          </div>

          <ActionButton
            href={HERO.ctaResume.href}
            variant="outline"
            size="lg"
            icon="filePdf"
            className="w-full !min-h-[3.35rem] !px-3 text-[0.78rem] min-[360px]:text-[0.82rem] sm:w-auto sm:!min-h-12 sm:!px-7 sm:text-[0.92rem]"
          >
            {HERO.ctaResume.label}
          </ActionButton>
        </motion.div>

        {/* Três provas curtas, para quem só olha a primeira tela. */}
        <motion.dl
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: base + 1.04, ease: EASE_OUT }}
          className="hero-proof mt-6 grid w-full max-w-[23rem] grid-cols-3 gap-0 rounded-[var(--radius-md)] border border-white/70 bg-white/65 px-1 py-4 [box-shadow:0_12px_32px_rgb(7_26_49/0.08)] backdrop-blur-md sm:mt-11 sm:max-w-2xl sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:[box-shadow:none] sm:backdrop-blur-none"
        >
          {HERO.proof.map((item, index) => (
            <motion.div
              key={item.value}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: base + 1.1 + index * 0.08, ease: EASE_OUT }}
              className="flex flex-col items-center border-r border-line-strong/70 px-1 text-center last:border-r-0 sm:border-r-0 sm:px-3"
            >
              <span
                aria-hidden="true"
                className="mb-2 inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-accent/25 bg-white/75 text-accent backdrop-blur-sm sm:mb-2.5"
              >
                <Icon name={item.icon} className="size-4 sm:size-4" weight="bold" />
              </span>
              {/* `R$ 200 mil+` é o rótulo mais largo. Preso ao vw, ele cabe na
                  coluna de 82px que sobra num aparelho de 320px. */}
              <dt className="font-display text-[clamp(0.78rem,3.6vw,0.95rem)] leading-tight font-bold tracking-[-0.035em] text-ink sm:text-[1.15rem]">
                {item.value}
              </dt>
              <dd className="mt-1 font-mono text-[clamp(0.48rem,2.2vw,0.56rem)] tracking-[0.06em] text-fg-muted uppercase sm:text-[0.64rem] sm:tracking-[0.1em]">
                {item.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
