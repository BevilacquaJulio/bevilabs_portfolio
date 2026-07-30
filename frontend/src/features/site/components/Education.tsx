import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { EDUCATION } from '../data/content';

export function Education() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="educacao"
      aria-labelledby="educacao-title"
      className="relative z-2 scroll-mt-24 py-10 md:py-14"
    >
      <div className="layout">
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-ink bg-bg-elevated">
          <div className="grid lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.5fr)]">
            <Reveal className="flex h-full flex-col justify-center bg-bg-muted p-4 sm:p-5 md:p-6 lg:border-r lg:border-ink">
              <h2
                id="educacao-title"
                className="max-w-[13ch] font-display text-[clamp(1.38rem,2.4vw,1.9rem)] leading-[1.06] font-extrabold tracking-[-0.042em] text-balance"
              >
                {EDUCATION.title}
              </h2>
            </Reveal>

            <motion.ul
              variants={staggerContainer}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={defaultViewport}
              className="grid border-t border-ink md:grid-cols-2 md:divide-x md:divide-line lg:border-t-0"
            >
              {EDUCATION.items.map((item) => (
                <motion.li
                  key={item.title}
                  variants={staggerItem}
                  className="flex min-h-44 flex-col border-b border-line p-4 last:border-b-0 sm:min-h-48 sm:p-5 md:border-b-0 md:p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink text-paper"
                    >
                      <Icon name={item.icon} className="size-5" weight="light" />
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.6rem] font-medium tracking-[0.04em] text-fg-muted">
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-auto pt-5">
                    <p className="font-mono text-[0.62rem] font-medium tracking-[0.04em] text-fg-subtle">
                      {item.period}
                    </p>
                    <h3 className="mt-2.5 max-w-[27ch] font-display text-[1.05rem] leading-[1.25] font-bold tracking-[-0.025em] text-balance">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.84rem] leading-snug text-fg-muted">{item.detail}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
