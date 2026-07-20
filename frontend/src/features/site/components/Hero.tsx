import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { StatusBadge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useCountUp } from '@/hooks/useCountUp';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HERO, HERO_STATS, PILLARS } from '../data/content';
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery';

export function Hero() {
  const { data } = useProjectsQuery();
  const projectCount = data?.total ?? 0;

  return (
    <main
      id="inicio"
      className="relative z-2 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden pt-28 pb-16 md:pt-32"
    >
      <Glow className="animate-float-slow top-[10%] -left-[10%] size-[400px]" />
      <Glow className="animate-float-slow bottom-[5%] -right-[15%] size-[500px] [animation-delay:-4s]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="layout flex flex-col items-stretch"
      >
        <section className="w-full text-center">
          <motion.div variants={staggerItem}>
            <StatusBadge className="mb-6 md:mb-8">{HERO.badge}</StatusBadge>
          </motion.div>

          <motion.h1 variants={staggerItem} className="mb-6 flex flex-col gap-2">
            <span className="text-[clamp(0.8rem,2.5vw,1.1rem)] font-medium tracking-[0.22em] text-fg-muted uppercase">
              {HERO.kicker}
            </span>
            <span className="neon-text font-display text-[clamp(2.25rem,9vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
              {HERO.brand}
              <sup className="reg reg--lg">®</sup>
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mx-auto mb-10 max-w-xl text-[clamp(0.95rem,2vw,1.15rem)] leading-relaxed font-light text-fg-muted"
          >
            {HERO.subtitle}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mb-14 flex flex-wrap justify-center gap-3 md:gap-4"
          >
            <a href={HERO.ctaPrimary.href} className="group w-full max-w-[280px] sm:w-auto">
              <Button variant="primary" className="w-full">
                {HERO.ctaPrimary.label}
              </Button>
            </a>
            <a href={HERO.ctaSecondary.href} className="w-full max-w-[280px] sm:w-auto">
              <Button variant="ghost" className="w-full">
                {HERO.ctaSecondary.label}
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="panel mx-auto flex w-full flex-col items-center gap-4 px-6 py-6 [box-shadow:var(--shadow-neon-glow)] sm:max-w-2xl sm:flex-row sm:justify-center sm:gap-8 sm:px-10"
          >
            {HERO_STATS.map((stat, index) => (
              <div key={stat.label} className="contents">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-px w-10 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:h-10 sm:w-px sm:bg-gradient-to-b"
                  />
                )}
                <Stat
                  {...stat}
                  value={stat.label === 'Projetos' ? projectCount : stat.value}
                />
              </div>
            ))}
          </motion.div>
        </section>

        <section className="mt-14 grid w-full grid-cols-1 gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
          {PILLARS.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              custom={index}
              className={cn(
                'group rounded-2xl border p-6 text-center transition-colors duration-300 md:p-8 md:px-6',
                pillar.highlight
                  ? 'border-transparent bg-black [box-shadow:var(--shadow-accent-glow-strong)]'
                  : 'border-line bg-bg-elevated [box-shadow:var(--shadow-neon-border)] hover:border-line-strong hover:[box-shadow:var(--shadow-neon-glow-strong)]',
              )}
            >
              <span
                className={cn(
                  'mb-5 inline-flex size-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                  pillar.highlight
                    ? 'bg-white/10 text-neon'
                    : 'bg-bg-subtle text-fg [box-shadow:var(--shadow-neon-border)]',
                )}
              >
                <Icon name={pillar.icon} className="size-6" />
              </span>
              <h3 className="mb-2 font-display text-[1.1rem] font-bold tracking-[-0.01em]">
                {pillar.title}
              </h3>
              <p
                className={cn(
                  'text-sm leading-relaxed font-light',
                  pillar.highlight ? 'text-white/60' : 'text-fg-muted',
                )}
              >
                {pillar.text}
              </p>
            </motion.article>
          ))}
        </section>
      </motion.div>
    </main>
  );
}

function Stat({
  value,
  suffix,
  label,
  countUp,
}: {
  value: number | string;
  suffix?: string;
  label: string;
  countUp: boolean;
}) {
  const target = typeof value === 'number' ? value : 0;
  const { ref, value: animated } = useCountUp(target);

  return (
    <div className="flex min-w-20 flex-col items-center gap-1">
      <span
        ref={ref}
        className="neon-text font-display text-[1.6rem] font-extrabold tracking-[-0.02em] tabular-nums md:text-[1.75rem]"
      >
        {countUp ? `${animated}${suffix ?? ''}` : value}
      </span>
      <span className="text-[0.72rem] font-medium tracking-[0.08em] text-fg-muted uppercase">
        {label}
      </span>
    </div>
  );
}

function Glow({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.05)_0%,transparent_70%)] blur-[100px]',
        className,
      )}
    />
  );
}
