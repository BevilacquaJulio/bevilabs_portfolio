import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';
import { JOURNEY, JOURNEY_SECTION, type JourneyEntry } from '../data/content';

/**
 * Trajetória.
 *
 * O trilho da esquerda se preenche conforme o leitor desce, e cada entrada só
 * acende quando a cabeça da linha passa por ela. Antes disso ela fica apagada,
 * e volta a apagar se o leitor sobe de novo: o estado segue a linha nos dois
 * sentidos, em vez de acender uma vez e ficar.
 *
 * A linha usa `useScroll` com o mesmo ponto de corte (62% da altura da tela)
 * que o `useInView` de cada entrada. É isso que mantém os dois em sincronia.
 */
export function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.62', 'end 0.72'],
  });

  return (
    <section
      id="trajetoria"
      aria-labelledby="trajetoria-title"
      className="surface-journey surface-texture relative z-[var(--z-content)] scroll-mt-24 py-14 sm:py-20 md:py-28"
    >
      <div className="layout">
        <SectionHeading
          id="trajetoria-title"
          label={JOURNEY_SECTION.label}
          title={JOURNEY_SECTION.title}
          subtitle={JOURNEY_SECTION.subtitle}
        />

        <ol ref={listRef} className="relative mt-12 md:mt-16">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[5px] w-px bg-line lg:left-[calc(11.25rem-0.5px)]"
          />
          <motion.span
            aria-hidden="true"
            style={reducedMotion ? undefined : { scaleY: scrollYProgress }}
            className="absolute inset-y-0 left-[4px] w-[3px] origin-top rounded-full bg-gradient-to-b from-accent-soft via-accent to-accent-deep [box-shadow:0_0_14px_rgb(39_101_204/0.55)] lg:left-[calc(11.25rem-1.5px)]"
          />

          {JOURNEY.map((entry, index) => (
            <Entry key={entry.id} entry={entry} last={index === JOURNEY.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Entry({ entry, last }: { entry: JourneyEntry; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const reducedMotion = useReducedMotion();

  /**
   * `-38%` no rodapé encolhe a raiz do observador até 62% da altura da tela: a
   * entrada conta como alcançada quando o topo dela cruza a marca onde está a
   * cabeça da linha. Sem `once`, para o estado voltar quando o leitor sobe.
   */
  const passed = useInView(ref, { amount: 0, margin: '0px 0px -38% 0px' });
  const lit = reducedMotion || passed;

  const education = entry.kind === 'education';

  return (
    <li
      ref={ref}
      className={cn(
        'relative grid pl-8 lg:grid-cols-[10rem_2.5rem_minmax(0,1fr)] lg:pl-0',
        last ? 'pb-0' : 'pb-11 md:pb-14',
      )}
    >
      <motion.p
        animate={{ opacity: lit ? 1 : 0.28 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className={cn(
          'meta pt-[1px] transition-colors duration-500 lg:pt-[3px] lg:text-right lg:leading-[1.6]',
          lit ? 'font-semibold text-accent-deep' : 'text-fg-subtle',
        )}
      >
        {entry.period}
      </motion.p>

      {/* Marcador. Acende com halo quando a cabeça da linha chega nele. */}
      <span
        aria-hidden="true"
        className="absolute top-[3px] left-0 lg:static lg:justify-self-center lg:pt-1"
      >
        <span className="relative grid size-[11px] place-items-center">
          {/* Onda que sai do marcador no instante em que ele acende. */}
          {lit && !education && !reducedMotion && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.85 }}
              animate={{ scale: 3.4, opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              className="absolute inset-0 rounded-full bg-accent"
            />
          )}
          <motion.span
            animate={{ scale: lit ? 1 : 0.66 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className={cn(
              'relative grid size-[11px] place-items-center rounded-full border-2 bg-bg transition-[border-color,box-shadow] duration-500',
              lit
                ? education
                  ? 'border-line-strong'
                  : 'border-accent [box-shadow:0_0_0_4px_rgb(39_101_204/0.16),0_0_18px_rgb(39_101_204/0.7)]'
                : 'border-line-strong',
            )}
          >
            <span
              className={cn(
                'size-[4px] rounded-full transition-colors duration-500',
                lit ? (education ? 'bg-line-strong' : 'bg-accent') : 'bg-line-strong',
              )}
            />
          </motion.span>
        </span>
      </span>

      <motion.div
        animate={{ opacity: lit ? 1 : 0.26, y: lit ? 0 : 10 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="relative mt-2.5 min-w-0 lg:mt-0"
      >
        {/* Brilho que nasce à esquerda do bloco aceso. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -inset-y-3 -left-5 -right-4 rounded-[var(--radius-md)]',
            'bg-[radial-gradient(60%_100%_at_0%_50%,rgb(39_101_204/0.09),transparent_72%)]',
            'transition-opacity duration-700 ease-[var(--ease-out)]',
            lit && !education ? 'opacity-100' : 'opacity-0',
          )}
        />

        <h3
          className={cn(
            'relative font-display leading-[1.15] font-bold tracking-[-0.035em] transition-colors duration-500',
            education ? 'text-[1.05rem] sm:text-[1.2rem]' : 'text-[1.25rem] sm:text-[1.5rem]',
            lit && !education ? 'text-accent-deep' : 'text-ink',
          )}
        >
          {entry.role}
        </h3>

        <p className="relative mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9rem] font-semibold text-fg-muted">
          {entry.org}
          {entry.link && (
            <a
              href={entry.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 rounded-full font-mono text-[0.68rem] font-medium tracking-[0.04em] text-accent transition-colors duration-200 hover:text-accent-deep"
            >
              {entry.link.label}
              <Icon
                name="arrowUpRight"
                className="size-3 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                weight="bold"
              />
            </a>
          )}
        </p>

        <p className="relative mt-3 max-w-[64ch] text-[0.92rem] leading-[1.65] text-fg-muted">
          {entry.summary}
        </p>

        {entry.highlight && (
          <p
            className={cn(
              'relative mt-4 inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 rounded-r-[var(--radius-sm)] border-l-[3px] py-2.5 pr-4 pl-3.5',
              'transition-[background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out)]',
              lit
                ? 'border-accent bg-accent/12 [box-shadow:0_8px_24px_rgb(39_101_204/0.16)]'
                : 'border-line-strong bg-transparent',
            )}
          >
            <span className="font-display text-[1.15rem] font-bold tracking-[-0.03em] text-accent-deep sm:text-[1.35rem]">
              {entry.highlight.value}
            </span>
            <span className="text-[0.82rem] text-fg-muted">{entry.highlight.label}</span>
          </p>
        )}

        {entry.tags.length > 0 && (
          <ul className="relative mt-4 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <li
                key={tag}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-mono text-[0.66rem] font-medium',
                  'transition-[background-color,border-color,color] duration-500 ease-[var(--ease-out)]',
                  lit
                    ? 'border-accent/30 bg-accent/8 text-accent-deep'
                    : 'border-line bg-bg-elevated text-fg-subtle',
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </li>
  );
}
