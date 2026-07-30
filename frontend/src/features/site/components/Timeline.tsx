import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { TIMELINE, TIMELINE_LINKS } from '../data/content';

const IMPACT_METRICS = [
  { value: 'R$ 200 mil+', label: 'processados em um evento presencial' },
  { value: '3', label: 'desenvolvedores sob liderança técnica' },
  { value: 'Ponta a ponta', label: 'do requisito ao deploy' },
] as const;

export function Timeline() {
  const shouldReduceMotion = useReducedMotion();
  const featured = TIMELINE[0];
  const entries = TIMELINE.slice(1);

  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-title"
      className="relative z-2 scroll-mt-24 overflow-hidden border-y border-line bg-bg-elevated py-12 sm:py-14 md:py-20"
    >
      <div className="layout">
        <Reveal className="border-b border-ink pb-6 md:pb-8">
          <h2
            id="experiencia-title"
            className="max-w-[15ch] font-display text-[1.58rem] leading-[1.06] font-extrabold tracking-[-0.042em] text-balance md:text-[clamp(1.72rem,3.2vw,2.55rem)] md:leading-[1.04] md:tracking-[-0.046em]"
          >
            Minha experiência profissional
          </h2>
          <p className="mt-4 max-w-[48ch] text-[0.92rem] leading-[1.6] text-fg-muted sm:text-[0.96rem] md:mt-5 md:text-[1.02rem]">
            Produtos em produção, projetos freelance e o laboratório onde testo novas soluções.
          </p>
        </Reveal>

        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="blueprint mt-6 overflow-hidden rounded-[var(--radius-md)] bg-ink text-paper [box-shadow:var(--shadow-float)] sm:rounded-[var(--radius-lg)] md:mt-10"
        >
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <div className="min-w-0 p-5 sm:p-6 md:p-8 lg:p-9">
              <p className="font-mono text-[0.66rem] text-white/58">{featured.period}</p>

              <h3 className="mt-6 max-w-full break-words font-display text-[1.14rem] leading-[1.14] font-extrabold tracking-[-0.036em] min-[360px]:text-[1.3rem] sm:mt-8 sm:max-w-[18ch] sm:text-[1.45rem] sm:text-balance md:mt-10 md:text-[clamp(1.48rem,2.7vw,2.2rem)] md:leading-[1.08] md:tracking-[-0.045em]">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-[58ch] text-[0.92rem] leading-[1.65] text-white/70 sm:text-[0.96rem]">
                {featured.text}
              </p>

              <p className="mt-6 border-t border-white/18 pt-4 font-mono text-[0.63rem] leading-relaxed text-white/58 sm:mt-8">
                {featured.tags.join(', ')}
              </p>
            </div>

            <dl className="grid min-w-0 grid-cols-2 gap-px border-t border-white/18 bg-white/18 p-px lg:border-t-0 lg:border-l">
              {IMPACT_METRICS.map((metric, index) => (
                <div
                  key={metric.value}
                  className={[
                    'flex min-h-28 flex-col justify-end bg-ink/94 p-4 sm:min-h-36 sm:p-5 md:p-6',
                    index === 0 ? 'col-span-2' : '',
                  ].join(' ')}
                >
                  <dt className="order-2 mt-3 max-w-[24ch] text-[0.78rem] leading-snug text-white/58">
                    {metric.label}
                  </dt>
                  <dd
                    className={[
                      'order-1 font-display leading-none font-extrabold tracking-[-0.055em]',
                      index === 0
                        ? 'text-[1.68rem] sm:text-[clamp(1.95rem,4vw,3rem)]'
                        : 'text-[1.2rem] sm:text-[clamp(1.45rem,2.1vw,1.85rem)]',
                    ].join(' ')}
                  >
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.article>

        <div className="mt-10 grid gap-6 md:mt-12 md:gap-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="font-display text-lg font-bold tracking-[-0.03em]">Outros trabalhos</p>
              <p className="mt-2 font-mono text-[0.62rem] leading-relaxed tracking-[0.07em] text-fg-subtle uppercase">
                {entries.length} sistemas e projetos
              </p>
            </div>
          </Reveal>

          <motion.ol
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={defaultViewport}
            className="grid gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10"
          >
            {entries.map((item) => {
              const link = TIMELINE_LINKS[item.title];

              return (
                <motion.li
                  key={item.title}
                  variants={staggerItem}
                  className="flex min-h-full flex-col border-t-2 border-ink pt-5"
                >
                  <p className="font-mono text-[0.64rem] font-medium tracking-[0.05em] text-fg-subtle">
                    {item.period}
                  </p>
                  <h3 className="mt-4 max-w-[25ch] font-display text-[1.15rem] leading-[1.22] font-bold tracking-[-0.03em] text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-[1.65] text-fg-muted">{item.text}</p>

                  <p className="mt-auto pt-5 font-mono text-[0.62rem] leading-relaxed text-fg-subtle">
                    {item.tags.join(', ')}
                  </p>

                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.82rem] font-semibold transition-[transform,background-color,border-color] duration-200 ease-[var(--ease-out)] hover:border-ink hover:bg-bg-subtle active:scale-[0.97]"
                    >
                      {link.label}
                      <Icon name="arrowUpRight" className="size-4" />
                    </a>
                  )}
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
