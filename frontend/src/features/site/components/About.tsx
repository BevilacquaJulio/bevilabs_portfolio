import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/lib/cn';
import { defaultViewport, EASE_OUT, hoverSpring } from '@/lib/motion';
import { ABOUT, ABOUT_METRICS, type Metric } from '../data/content';

/**
 * Sobre.
 *
 * A primeira frase é tratada como abertura, em corpo grande: ela sozinha diz o
 * que ele faz. As outras duas explicam como. Embaixo, quatro números em cards
 * altos, e o mais forte deles em azul cheio, para o olho ter onde parar.
 */
export function About() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="surface-about relative z-[var(--z-content)] scroll-mt-24 py-14 sm:py-20 md:py-28"
    >
      <div className="layout">
        <SectionHeading id="sobre-title" label={ABOUT.label} title={ABOUT.title} />

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            className="max-w-[46ch] text-[1.12rem] leading-[1.55] font-semibold tracking-[-0.015em] text-ink text-pretty sm:text-[1.32rem]"
          >
            {ABOUT.paragraphs[0]}
          </motion.p>

          <div className="max-w-[58ch] space-y-4 lg:pt-1.5">
            {ABOUT.paragraphs.slice(1).map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={defaultViewport}
                transition={{ duration: 0.55, delay: 0.2 + index * 0.09, ease: EASE_OUT }}
                className="text-[0.95rem] leading-[1.7] text-fg-muted sm:text-[1rem]"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>

        <ul className="mt-11 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:mt-16 lg:grid-cols-4">
          {ABOUT_METRICS.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const featured = Boolean(metric.featured);

  const target = metric.value ?? 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => String(Math.round(value)));

  useEffect(() => {
    if (!inView || metric.value === undefined) return;

    if (reducedMotion) {
      count.set(target);
      return;
    }

    const controls = animate(count, target, {
      duration: 1.3,
      delay: 0.12 + index * 0.08,
      ease: EASE_OUT,
    });

    return () => controls.stop();
  }, [inView, reducedMotion, count, target, index, metric.value]);

  const readable = metric.text ?? `${metric.prefix ?? ''}${metric.value}${metric.suffix ?? ''}`;

  return (
    <motion.li
      ref={ref}
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_OUT }}
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -6 }}
        transition={hoverSpring}
        className={cn(
          'group relative flex h-full min-h-[9.75rem] flex-col justify-between overflow-hidden rounded-[var(--radius-md)] p-4 sm:min-h-[13.5rem] sm:p-6',
          'transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out)]',
          featured
            ? 'border border-accent-deep bg-accent text-on-accent [box-shadow:0_18px_44px_rgb(27_79_166/0.32)] hover:[box-shadow:0_26px_60px_rgb(27_79_166/0.42)]'
            : 'border border-line bg-bg-elevated [box-shadow:var(--shadow-panel)] hover:border-accent/45 hover:[box-shadow:0_20px_46px_rgb(7_26_49/0.1)]',
        )}
      >
        {featured && <span aria-hidden="true" className="blueprint absolute inset-0 opacity-70" />}

        <span
          aria-hidden="true"
          className={cn(
            'relative inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] border sm:size-11',
            'transition-[background-color,border-color,transform] duration-300 ease-[var(--ease-out)]',
            'group-hover:scale-105 motion-reduce:transform-none',
            featured
              ? 'border-white/25 bg-white/15 text-on-accent'
              : 'border-line bg-bg-subtle text-accent group-hover:border-accent/40 group-hover:bg-accent/12',
          )}
        >
          <Icon name={metric.icon} className="size-5" weight="bold" />
        </span>

        <div className="relative mt-4 sm:mt-6">
          <p
            aria-hidden="true"
            className={cn(
              'font-display leading-[0.95] font-bold tracking-[-0.05em] tabular-nums',
              metric.text
                ? 'text-[clamp(1.5rem,3.4vw,1.95rem)]'
                : 'text-[clamp(2.1rem,5.4vw,3rem)]',
              featured ? 'text-on-accent' : 'text-ink',
            )}
          >
            {metric.text ?? (
              <>
                {metric.prefix}
                <motion.span>{rounded}</motion.span>
                {metric.suffix}
              </>
            )}
          </p>
          <p
            aria-hidden="true"
            className={cn(
              'mt-3 text-[0.84rem] leading-[1.45]',
              featured ? 'text-white/85' : 'text-fg-muted',
            )}
          >
            {metric.label}
          </p>
          <span className="sr-only">
            {readable} {metric.label}
          </span>
        </div>

        {!featured && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
        )}
      </motion.div>
    </motion.li>
  );
}
