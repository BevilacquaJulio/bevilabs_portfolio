import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { ABOUT, ABOUT_STATS, PROFILE } from '../data/content';

export function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative z-2 scroll-mt-24 py-12 md:py-20"
    >
      <div className="layout">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.5fr)] lg:gap-12 xl:gap-14">
          <Reveal className="lg:pt-2">
            <h2
              id="sobre-title"
              className="max-w-[9ch] font-display text-[1.6rem] leading-[1.05] font-extrabold tracking-[-0.042em] text-balance md:text-[clamp(1.75rem,3.4vw,2.6rem)] md:leading-[1.01] md:tracking-[-0.048em]"
            >
              {ABOUT.title}
            </h2>

            <div className="mt-5 flex items-center gap-3.5 sm:mt-6">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink font-display text-[0.78rem] font-extrabold text-paper"
              >
                {PROFILE.initials}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base leading-tight font-bold tracking-[-0.025em]">
                  {PROFILE.name}
                </p>
                <p className="mt-1 text-[0.8rem] leading-snug text-fg-muted">{PROFILE.role}</p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 border-t border-line pt-5 min-[390px]:grid-cols-2 sm:mt-6 sm:gap-y-5 sm:pt-6 lg:grid-cols-1">
              {ABOUT.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[0.58rem] font-medium tracking-[0.11em] text-fg-subtle uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 max-w-[32ch] text-[0.84rem] leading-snug text-fg">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="min-w-0">
            <div className="blueprint relative overflow-hidden rounded-[var(--radius-md)] bg-ink p-5 text-paper sm:rounded-[var(--radius-lg)] sm:p-6 md:p-8 lg:p-9">
              <div className="relative z-1 flex items-center justify-between gap-5">
                <span className="font-mono text-[0.62rem] font-medium tracking-[0.12em] text-white/55 uppercase">
                  Tese de trabalho
                </span>
                <span className="flex items-center gap-2 font-mono text-[0.6rem] text-white/55 uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
                  Em produção
                </span>
              </div>

              <p className="relative z-1 mt-7 max-w-[24ch] font-display text-[1.25rem] leading-[1.15] font-semibold tracking-[-0.032em] text-balance sm:mt-8 sm:text-[1.35rem] md:mt-10 md:text-[clamp(1.35rem,2.5vw,1.95rem)] md:leading-[1.12] md:tracking-[-0.038em]">
                {ABOUT.lead}
              </p>

              <div className="relative z-1 mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/18 pt-4 font-mono text-[0.58rem] tracking-[0.045em] text-white/55 uppercase sm:mt-9 sm:gap-x-3 sm:text-[0.62rem] sm:tracking-[0.06em]">
                <span>Banco</span>
                <span aria-hidden="true">→</span>
                <span>API</span>
                <span aria-hidden="true">→</span>
                <span>Interface</span>
                <span aria-hidden="true">→</span>
                <span>Deploy</span>
              </div>
            </div>
          </Reveal>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-10 grid gap-3 border-t border-line pt-10 sm:grid-cols-2 md:mt-12 md:gap-4 md:pt-12 lg:grid-cols-4"
        >
          {ABOUT.approach.map((item, index) => (
            <motion.li
              key={item.label}
              variants={staggerItem}
              className="group rounded-[var(--radius-md)] border border-line bg-bg-elevated/70 p-4 transition-[border-color,background-color,box-shadow] duration-200 ease-[var(--ease-out)] hover:border-line-strong hover:bg-bg-elevated hover:shadow-[0_10px_30px_rgb(16_16_15_/_0.04)] motion-reduce:transition-none sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.62rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
                  {item.label}
                </p>
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.62rem] tabular-nums text-fg-subtle/70 transition-colors duration-200 group-hover:text-fg-muted"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-3.5 font-display text-base leading-snug font-bold tracking-[-0.02em]">
                {item.title}
              </p>
              <p className="mt-2 text-[0.85rem] leading-[1.58] text-fg-muted">{item.text}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.dl
          variants={staggerContainer}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] bg-ink p-px md:mt-12 lg:grid-cols-5"
        >
          {ABOUT_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className={[
                'flex min-h-28 flex-col justify-end p-4 sm:min-h-32 sm:p-5 md:p-6',
                index === 0 ? 'col-span-2 bg-ink text-paper lg:col-span-2' : 'bg-bg-elevated',
                index === ABOUT_STATS.length - 1 ? 'col-span-2 lg:col-span-1' : '',
              ].join(' ')}
            >
              <dt
                className={[
                  'order-2 mt-3 max-w-[21ch] text-[0.8rem] leading-snug',
                  index === 0 ? 'text-white/62' : 'text-fg-muted',
                ].join(' ')}
              >
                {stat.label}
              </dt>
              <dd
                className={[
                  'order-1 font-display leading-none font-extrabold tracking-[-0.055em]',
                  index === 0
                    ? 'text-[1.75rem] sm:text-[clamp(1.9rem,4vw,2.9rem)]'
                    : 'text-[1.28rem] sm:text-[clamp(1.45rem,2.2vw,1.85rem)]',
                ].join(' ')}
              >
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
